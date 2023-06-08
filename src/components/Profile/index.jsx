import React, { useCallback, useContext, useEffect, useState } from "react";
import "../../scss/Profile.scss";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
} from "antd";
import { database, storage } from "../../firebase";
import { doc, setDoc, Timestamp, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";
import Loading from "../Loading";

const options = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const Profile = ({ visible, setVisible }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState("");
  const [profile, setProfile] = useState();
  const [form] = Form.useForm();
  const { currentUser } = useContext(AuthContext);

  const openCreate = () => {
    setProfile(undefined);
    form.resetFields();
    form.setFieldsValue({
      email: currentUser.email,
    });
  };

  const openUpdate = (profile) => {
    form.setFieldsValue({
      email: currentUser.email,
      name: profile.name,
      birthday: moment(profile.birthday.toDate()),
      phone: profile.phone,
      address: profile.address,
      gender: profile.gender,
      image: profile.image.nameImg,
    });
    setImageUrl(profile.image);
  };

  const listenProfile = useCallback(async () => {
    const unsubscribe = onSnapshot(
      doc(database, "people", currentUser.email),
      (doc) => {
        setProfile(doc.data());
      }
    );

    return unsubscribe;
  }, [currentUser.email]);

  useEffect(() => {
    listenProfile();
    return () => {
      listenProfile();
    };
  }, [listenProfile]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const querySnapshot = await getDoc(
  //         doc(database, "people", currentUser.email)
  //       );
  //       setProfile(querySnapshot?.data());
  //       console.log("querySnapshot?.data():", querySnapshot.data());
  //       if (querySnapshot.data()) {
  //         openUpdate(querySnapshot.data());
  //       } else {
  //         openCreate();
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   return () => {
  //     fetchData();
  //   };
  // }, [currentUser.email]);

  useEffect(() => {
    if (profile) {
      openUpdate(profile);
      return;
    }
    openCreate();
    // eslint-disable-next-line
  }, [currentUser.email, profile]);

  const onFinish = async (values) => {
    if (profile) {
      setImageUrl(null);
      await updateData(values);
      return;
    }
    await createData(values);
  };

  const createData = async (values) => {
    try {
      await createImgFireBase(values);

      message.open({
        type: "success",
        content: "Create Profile Success !",
      });
    } catch (error) {
      message.open({
        type: "error",
        content: "Create Profile Error !",
      });
    }
    return;
  };

  const updateData = async (values) => {
    try {
      await UploadImgFireBase(values);

      message.open({
        type: "success",
        content: "Edit Profile Success !",
      });
    } catch (error) {
      message.open({
        type: "error",
        content: "Edit Profile Error !",
      });
    }
    return;
  };

  const createImgFireBase = async (values) => {
    const name = new Date().getTime() + "_" + file.name;

    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    await uploadTask.on(
      "state_changed",
      async (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref).then(
          async (downloadURL) => {
            setImageUrl({ downloadURL, nameImg: name });
            const docData = imageUrl && {
              ...values,
              birthday: Timestamp.fromDate(new Date(values.birthday)),
              image: { downloadURL, nameImg: name },
            };
            await setDoc(doc(database, "people", currentUser.email), docData);
          }
        );
      }
    );
  };
  const UploadImgFireBase = async (values) => {
    if (file) {
      const name = new Date().getTime() + "_" + file.name;

      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await uploadTask.on(
        "state_changed",
        async (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await deleteImgFirebase(profile?.image?.nameImg);

              setImageUrl({ downloadURL, nameImg: name });
              const docData = {
                ...values,
                birthday: Timestamp.fromDate(new Date(values.birthday)),
                image: { downloadURL, nameImg: name },
              };
              await updateDoc(
                doc(database, "people", currentUser.email),
                docData
              );
            }
          );
        }
      );
      return;
    }
    if (!file) {
      const oldData = await getDoc(doc(database, "people", currentUser.email));
      setImageUrl({
        downloadURL: oldData.data().image.downloadURL,
        nameImg: oldData.data().image.nameImg,
      });
      const updateData = {
        ...oldData.data(),
        ...values,
        image: oldData.data().image,
        birthday: Timestamp.fromDate(new Date(values.birthday)),
      };
      const docRef = doc(database, "people", currentUser.email);
      await updateDoc(docRef, {
        ...updateData,
      });
      return;
    }
  };
  const onFinishFailed = (errorInfo) => {
    message.open({
      type: "error",
      content: "Profile Error!",
    });
  };

  const deleteImgFirebase = async (nameImg) => {
    if (!nameImg) {
      message.open({
        type: "error",
        content: "Image Not Found !",
      });
      return;
    }
    const desertRef = ref(storage, nameImg);

    deleteObject(desertRef)
      .then(() => {
        console.log("Delete Img");
      })
      .catch((err) => {
        message.open({
          type: "error",
          content: "Delete Image Error !",
        });
      });
  };

  const onChangeImg = (e) => {
    setFile(e.target.files[0]);
    const src = URL.createObjectURL(e.target.files[0]);
    setImageUrl({ downloadURL: src });
  };

  const hideModal = () => {
    setVisible(false);
    if (profile) {
      openUpdate(profile);
    }
  };

  return (
    <Modal
      destroyOnClose={true}
      open={visible}
      footer={false}
      onCancel={() => hideModal()}
      className="profile__modal"
    >
      {/* <Header /> */}
      <div className="profile__wrapper">
        <h2>Profile</h2>
        {currentUser ? (
          <Form
            form={form}
            layout="vertical"
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="profile__form"
            // initialValues={{ email: currentUser.email }}
          >
            <Row className="w-100" gutter={[48, 16]}>
              <Col
                xs={12}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please input your name!" },
                  ]}
                  // initialValue={currentUser && currentUser.email}
                >
                  <Input className="input profile__input--black" disabled />
                </Form.Item>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: "Please input your name!" },
                  ]}
                >
                  <Input className="input profile__input--black" />
                </Form.Item>
                <Form.Item
                  name="birthday"
                  label="Birthday"
                  rules={[
                    { required: true, message: "Please input your birthday!" },
                  ]}
                >
                  <DatePicker
                    className="input profile__input--black"
                    placeholder="YYYY-MM-DD"
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone number"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input className="input profile__input--black" />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    { required: true, message: "Please input your address!" },
                  ]}
                >
                  <Input className="input profile__input--black" />
                </Form.Item>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[
                    { required: true, message: "Please input your gender!" },
                  ]}
                >
                  <Radio.Group
                    options={options}
                    optionType="button"
                    className="profile__radio"
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                {/* <h3>Image Profile</h3> */}
                <Form.Item
                  name="image"
                  label="Image Profile"
                  rules={[
                    { required: true, message: "Please input your Image!" },
                  ]}
                >
                  <div className="profile__image">
                    <input
                      type="file"
                      id="file"
                      onChange={(e) => onChangeImg(e)}
                    />
                    {imageUrl && imageUrl.downloadURL ? (
                      <img
                        src={
                          imageUrl?.downloadURL ||
                          "https://i.pinimg.com/originals/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
                        }
                        alt="avatar"
                      />
                    ) : (
                      <Loading />
                    )}
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Button
                  className="btn btn__tinderColor profile_btn"
                  shape="round"
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        ) : (
          <Loading />
        )}
      </div>
    </Modal>
  );
};

export default Profile;

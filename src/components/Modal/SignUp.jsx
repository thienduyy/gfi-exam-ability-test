import LogoTinder from "../../assets/svgs/Logo";
import "../../scss/ModalLogin.scss";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../firebase";

const SignUp = ({ visible, setVisible }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const { username: email, password } = values;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        message.open({
          type: "success",
          content: "Create Account Success!",
        });
      })
      .catch((err) => {
        message.open({
          type: "error",
          content: "Create Account Fail!",
        });
      });
    setVisible(false);
  };
  const onFinishFailed = (errorInfo) => {
    message.open({
      type: "error",
      content: "Create Account Fail!",
    });
    console.log("Failed:", errorInfo);
  };

  // validate new password

  const passwordValidator = (_, value) => {
    if (!value || value.length <= 8) {
      return Promise.reject("Must more than 8 character!");
    }
    return Promise.resolve();
  };

  // validate retype password

  const retypePasswordValidator = (_, value) => {
    if (value && form.getFieldValue("password") === value) {
      return Promise.resolve();
    }

    return Promise.reject("Not match!");
  };

  return (
    <Modal
      className="modal-black"
      destroyOnClose={true}
      open={visible}
      footer={false}
      onCancel={() => setVisible(false)}
    >
      <Row>
        <Col span={24} className="signin__header">
          <LogoTinder />
          <h2 className="signin__header--title mt-8">Create Account</h2>
        </Col>
        <Form
          form={form}
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="w-100"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please input your email!" },
              {
                pattern: /^[A-Za-z0-9@.]+$/,
                message: "Only letters and numbers or email!",
              },
            ]}
          >
            <Col span={24}>
              <h3 className="signin__form--label">Email</h3>
              <Input type="email" className="input signin__input--black" />
            </Col>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                validator: passwordValidator,
              },
            ]}
          >
            <Col span={24}>
              <h3 className="signin__form--label">Password</h3>

              <Input.Password className="input signin__input--black" />
            </Col>
          </Form.Item>
          <Form.Item
            name="retypePassword"
            rules={[
              { required: true, message: "Please retype your password!" },
              {
                validator: retypePasswordValidator,
              },
            ]}
          >
            <Col span={24}>
              <h3 className="signin__form--label">Retype Password</h3>

              <Input.Password className="input signin__input--black" />
            </Col>
          </Form.Item>

          <Col className="f-center">
            <Button
              className="btn btn__tinderColor"
              shape="round"
              type="primary"
              htmlType="submit"
            >
              Create
            </Button>
          </Col>
        </Form>
      </Row>
    </Modal>
  );
};

export default SignUp;

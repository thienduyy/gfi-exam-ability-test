import { Modal } from "antd";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { database } from "../../firebase";
import "../../scss/Pairing.scss";
import Loading from "../Loading";

const PairingList = ({ visible, setVisible, currentUser }) => {
  const [pairing, setPairing] = useState([]);
  const [rootUser, setRootUser] = useState([]);
  const [targetUser, setTargetUser] = useState([]);

  const listRoot = useCallback(async () => {
    const unsubscribe = onSnapshot(
      query(
        collection(database, "pairing-list"),
        where("targetUser", "==", currentUser.email),
        where("type", "==", "matched")
      ),
      (snapShot) => {
        const data = snapShot.docs.map((doc) => doc.data().rootUser);
        setRootUser(data);
      }
    );

    return unsubscribe;
  }, [currentUser.email]);

  const listTarget = useCallback(async () => {
    const unsubscribe = onSnapshot(
      query(
        collection(database, "pairing-list"),
        where("rootUser", "==", currentUser.email),
        where("type", "==", "matched")
      ),
      (snapShot) => {
        const data = snapShot.docs.map((doc) => doc.data().targetUser);
        setTargetUser(data);
      }
    );

    return unsubscribe;
  }, [currentUser.email]);

  const listenPairing = useCallback(async () => {
    const userPairing = [...rootUser, ...targetUser];
    const uniqueUser = [...new Set(userPairing)];
    if (uniqueUser.length === 0) {
      // Nếu mảng uniqueUser rỗng, không cần thực hiện truy vấn
      return;
    }

    const unsubscribe = onSnapshot(
      query(collection(database, "people"), where("email", "in", uniqueUser)),
      (snapShot) => {
        const data = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPairing(data);
      }
    );

    return unsubscribe;
  }, [rootUser, targetUser]);
  useEffect(() => {
    listRoot();
    listTarget();

    return () => {
      listRoot();
      listTarget();
    };
  }, [listRoot, listTarget]);

  useEffect(() => {
    listenPairing();
    return () => {
      listenPairing();
    };
  }, [listRoot, listTarget, listenPairing]);

  return (
    <Modal
      destroyOnClose={true}
      open={visible}
      footer={false}
      onCancel={() => setVisible(false)}
      className="pairing__modal"
    >
      <div className="pairing__wrapper">
        <h2>Pairing List</h2>
        <div className="pairing__form">
          {pairing && pairing?.length > 0 ? (
            pairing.map((item, index) => (
              <div className="pairing__item" key={index}>
                <img
                  src={
                    item?.image?.downloadURL ||
                    "https://i.pinimg.com/originals/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
                  }
                  alt={item?.image?.nameImg}
                />
                <h4>{item?.name}</h4>
              </div>
            ))
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PairingList;

import React, { useCallback, useContext, useEffect, useState } from "react";
import Header from "./Header";
import "../../scss/AppPage.scss";
import Card from "./Card";
import { AuthContext } from "../../context/AuthContext";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { database } from "../../firebase";
import Wait from "../../assets/wait.png";
import Profile from "../Profile";

const AppComponent = () => {
  const [people, setPeople] = useState();
  const { currentUser } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);

  const listenData = useCallback(async () => {
    const userNotDisplay = [currentUser.email];
    const usersDislike = await getDocs(
      query(
        collection(database, "dislike-list"),
        where("rootUser", "==", currentUser.email)
      )
    );
    usersDislike.forEach((doc) => {
      userNotDisplay.push(doc.data().targetUser);
    });

    const findTarget = await getDocs(
      query(
        collection(database, "pairing-list"),
        where("rootUser", "==", currentUser.email)
      )
    );
    findTarget.forEach((doc) => {
      userNotDisplay.push(doc.data().targetUser);
    });

    const findRoot = await getDocs(
      query(
        collection(database, "pairing-list"),
        where("targetUser", "==", currentUser.email),
        where("type", "==", "matched")
      )
    );
    findRoot.forEach((doc) => {
      userNotDisplay.push(doc.data().rootUser);
    });

    const uniqueUser = [...new Set(userNotDisplay)];
    const unsubscribe = onSnapshot(
      query(
        collection(database, "people"),
        where("email", "not-in", uniqueUser)
      ),
      (snapShot) => {
        const data = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPeople(data);
      }
    );

    return unsubscribe;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    listenData();

    return () => {
      setPeople([]);
      listenData();
    };
  }, [listenData]);

  return (
    <div className="app__wrapper">
      <Header />
      {people && people.length && currentUser ? (
        <Card people={people} currentUser={currentUser} />
      ) : (
        <img className="app_wait" src={Wait} alt="Img_waiting"/>
      )}
      <Profile visible={visible} setVisible={setVisible} />
    </div>
  );
};

export default AppComponent;

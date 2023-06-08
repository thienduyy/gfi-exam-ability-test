import React, { useCallback, useContext, useEffect, useState } from "react";
import Header from "./Header";
import "../../scss/AppPage.scss";
import Card from "./Card";
import { AuthContext } from "../../context/AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { database } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";

const AppComponent = () => {
  const navigate = useNavigate();
  const [people, setPeople] = useState();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDoc(
          doc(database, "people", currentUser.email)
        );
        if (querySnapshot && !querySnapshot.data()) {
          navigate("/profile");
        }
      } catch (err) {
        console.log(err);
      }
    };

    return () => {
      fetchData();
    };
  }, []);

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
        <Loading />
      )}
    </div>
  );
};

export default AppComponent;

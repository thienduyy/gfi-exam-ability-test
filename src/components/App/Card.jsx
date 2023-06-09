import { Button } from "antd";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useCallback, useMemo, useRef, useState } from "react";
import TinderCard from "react-tinder-card";
import { database } from "../../firebase";
import CloseIcon from "../../assets/svgs/CloseIcon";
import FavoriteIcon from "../../assets/svgs/FavoriteIcon";
import FlashOnIcon from "../../assets/svgs/FlashOnIcon";
import ReplayIcon from "../../assets/svgs/ReplayIcon";
import StarRateIcon from "../../assets/svgs/StarRateIcon";
import Wait from "../../assets/wait.png";
const Card = ({ people, currentUser }) => {
  const [currentIndex, setCurrentIndex] = useState(
    people && Number(people?.length) - 1
  );

  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo(
    () =>
      Array(people.length)
        .fill(0)
        .map((i) => React.createRef()),
    // eslint-disable-next-line
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < people.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const swiped = useMemo(() => {
    return async (dir, item, index) => {
      updateCurrentIndex(index - 1);
      if (dir === "left") {
        await addUserDislike(currentUser.email, item.email);
      }
      if (dir === "right") {
        const userPairing = await findUserPairing(item);
        if (userPairing.length === 0) {
          await saveUserPairing(currentUser.email, item.email);
        }
        if (userPairing.length > 0) {
          await updateUserPairing(userPairing[0]);
        }
      }
    };
    // eslint-disable-next-line
  }, []);

  const findUserPairing = useCallback(async (item) => {
    const q = query(
      collection(database, "pairing-list"),
      where("rootUser", "==", item.email),
      where("targetUser", "==", currentUser.email)
    );
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
    // eslint-disable-next-line
  }, []);

  const saveUserPairing = useCallback(async (rootUser, targetUser) => {
    const id = `${rootUser}_${targetUser}`;
    await setDoc(doc(database, "pairing-list", id), {
      rootUser,
      targetUser,
      type: "follow",
    });
    // eslint-disable-next-line
  }, []);

  const updateUserPairing = useCallback(async (data) => {
    const docRef = doc(database, "pairing-list", data.id);
    await updateDoc(docRef, {
      type: "matched",
    });
    // eslint-disable-next-line
  }, []);

  const addUserDislike = useCallback(async (rootUser, targetUser) => {
    const id = `${rootUser}_${targetUser}`;
    await setDoc(doc(database, "dislike-list", id), {
      rootUser,
      targetUser,
      type: "dislike",
    });
    // eslint-disable-next-line
  }, []);

  const outOfFrame = (item, idx) => {
    console.log(
      `${item.name} (${idx}) left the screen!`,
      currentIndexRef.current
    );
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  return (
    <>
      <div className="card__wrapper">
        {people &&
          people?.length > 0 &&
          people.map((item, index) => (
            <TinderCard
              ref={childRefs[index]}
              key={item.email}
              className="card__swipe"
              preventSwipe={["up", "down"]}
              onSwipe={(dir) => swiped(dir, item, index)}
              onCardLeftScreen={() => outOfFrame(item, index)}
            >
              <div
                className="card_container"
                style={{
                  backgroundImage: `url(${
                    item?.image?.downloadURL ||
                    "https://i.pinimg.com/originals/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
                  })`,
                }}
              >
                <h3>{item.name}</h3>
              </div>
            </TinderCard>
          ))}
        {!canSwipe && (
          <img className="card_container" src={Wait} alt="waiting" />
        )}
      </div>
      <div className="swipeButtons">
        <Button className="swipeButtons__repeat">
          <ReplayIcon />
        </Button>
        <Button
          className="swipeButtons__left"
          onClick={() => swipe("left")}
          disabled={!canSwipe}
        >
          <CloseIcon />
        </Button>
        <Button className="swipeButtons__star">
          <StarRateIcon />
        </Button>
        <Button
          className="swipeButtons__right"
          onClick={() => swipe("right")}
          disabled={!canSwipe}
        >
          <FavoriteIcon />
        </Button>
        <Button className="swipeButtons__lightning">
          <FlashOnIcon />
        </Button>
      </div>
      {/* <SwipeButtons /> */}
    </>
  );
};

export default Card;

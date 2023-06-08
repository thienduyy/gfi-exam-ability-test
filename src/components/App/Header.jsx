import React, { useContext, useState } from "react";
import Group from "../../assets/svgs/Group";
import User from "../../assets/svgs/User";
import { Button, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "@firebase/auth";
import { AuthContext } from "../../context/AuthContext";
import PairingList from "./PairingList";
import Profile from "../Profile";

const Header = () => {
  const [visiblePairing, setVisiblePairing] = useState(false);
  const [visibleProfile, setVisibleProfile] = useState(false);
  const { dispatch, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const logOut = () => {
    signOut(auth).then(() => {
      dispatch({ type: "LOGOUT" });
      navigate("/");
    });
  };

  const items = [
    {
      key: "1",
      label: (
        <Button
          className="btn header_btn"
          onClick={() => setVisibleProfile(true)}
        >
          Profile
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button className="btn header_btn" onClick={logOut}>
          Logout
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="header__wrapper">
        <Button
          className="btn header_btn"
          onClick={() => setVisiblePairing(true)}
        >
          <Group />
        </Button>
        <Link to="/app">
          <img
            className="header__logo"
            src="https://w7.pngwing.com/pngs/399/756/png-transparent-tinder-logo-computer-icons-tinder-angle-logo-magenta-thumbnail.png"
            alt="tinder logo"
          />
        </Link>
        <Dropdown
          menu={{
            items,
          }}
          placement="bottomLeft"
        >
          <Button
            className="btn header_btn"
            onClick={(e) => e.preventDefault()}
          >
            <User />
          </Button>
        </Dropdown>
      </div>
      <PairingList
        visible={visiblePairing}
        setVisible={setVisiblePairing}
        currentUser={currentUser}
      />
      <Profile visible={visibleProfile} setVisible={setVisibleProfile} />
    </>
  );
};

export default Header;

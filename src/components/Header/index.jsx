import React, { useState } from "react";
import { Link } from "react-router-dom";
import TinderLogo from "./TinderLogo";
import { Button, Modal } from "antd";
import SignIn from "../Modal/SignIn";

const Header = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="header__wrapper">
      <Link to="/">
        <TinderLogo />
      </Link>
      <Button onClick={() => setVisible(true)} className="btn btn__scale">
        Log in
      </Button>
      <Modal
        destroyOnClose={true}
        open={visible}
        footer={false}
        onCancel={() => setVisible(false)}
        className="modal-black"
      >
        <SignIn />
      </Modal>
    </div>
  );
};

export default Header;

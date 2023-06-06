import React, { useState } from "react";

import { Button, Modal } from "antd";
import SignUp from "../Modal/SignUp";

const Content = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="content__wrapper">
      <h1 className="content__text">Swipe Right®</h1>
      <Button
        onClick={() => setVisible(true)}
        className="btn btn__tinderColor content__btn btn__scale mt-24"
      >
        Create Account
      </Button>
      <Modal
        className="modal-black"
        destroyOnClose={true}
        open={visible}
        footer={false}
        onCancel={() => setVisible(false)}
      >
        <SignUp />
      </Modal>
    </div>
  );
};

export default Content;

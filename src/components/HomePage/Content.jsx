import React, { useState } from "react";

import { Button } from "antd";
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

      <SignUp visible={visible} setVisible={setVisible} />
    </div>
  );
};

export default Content;

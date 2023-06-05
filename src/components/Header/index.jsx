import React from "react";
import { Link } from "react-router-dom";
import TinderLogo from "./TinderLogo";
import { Button } from "antd";

const Header = () => {
  return (
    <div className="header__wrapper">
      <Link to="/">
        <TinderLogo />
      </Link>
      <Button className="btn btn__scale">Log in</Button>
    </div>
  );
};

export default Header;

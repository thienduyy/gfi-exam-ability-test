import { Button } from "antd";
import SignIn from "../Modal/SignIn";

const Content = () => {
  return (
    <div className="content__wrapper">
      <h1 className="content__text">Swipe Right®</h1>
      <Button className="btn content__btn btn__scale">Create Account</Button>
      <SignIn />
    </div>
  );
};

export default Content;

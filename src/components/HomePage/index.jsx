import "../../scss/HomePage.scss";
import Header from "../Header";
import Content from "./Content";

const HomePage = () => {
  return (
    <div className="homepage__wrapper">
      <Header />
      <Content />
    </div>
  );
};

export default HomePage;

import { Button } from "antd";
import CloseIcon from "../../assets/svgs/CloseIcon";
import FavoriteIcon from "../../assets/svgs/FavoriteIcon";
import FlashOnIcon from "../../assets/svgs/FlashOnIcon";
import ReplayIcon from "../../assets/svgs/ReplayIcon";
import StarRateIcon from "../../assets/svgs/StarRateIcon";

const SwipeButtons = () => {
  return (
    <div className="swipeButtons">
      <Button className="swipeButtons__repeat">
        <ReplayIcon />
      </Button>
      <Button className="swipeButtons__left">
        <CloseIcon />
      </Button>
      <Button className="swipeButtons__star">
        <StarRateIcon />
      </Button>
      <Button className="swipeButtons__right">
        <FavoriteIcon />
      </Button>
      <Button className="swipeButtons__lightning">
        <FlashOnIcon />
      </Button>
    </div>
  );
};

export default SwipeButtons;

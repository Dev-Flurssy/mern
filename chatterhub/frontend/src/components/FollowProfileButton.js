import PropTypes from "prop-types";
import "./../styles/Followers.css";

export default function FollowProfileButton({ following, onButtonClick }) {
  return (
    <div className="follow-btn-container">
      <button
        className={`follow-btn ${following ? "unfollow" : ""}`}
        onClick={onButtonClick}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
}

FollowProfileButton.propTypes = {
  following: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

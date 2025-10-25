import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/Followers.css";

export default function FollowGrid({ people }) {
  return (
    <div className="follow-grid-container">
      {people.map((person) => (
        <div key={person._id} className="follow-grid-item">
          <Link to={`/user/${person._id}`} className="follow-link">
            <img
              src={`/api/users/photo/${person._id}`}
              alt={person.name}
              className="follow-avatar"
              onError={(e) => (e.target.src = "/api/users/defaultphoto")}
            />
            <span className="follow-name">{person.name}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}

FollowGrid.propTypes = {
  people: PropTypes.array.isRequired,
};

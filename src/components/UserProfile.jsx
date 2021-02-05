import { Link } from "react-router-dom";
import Logout from "./Logout";
import TutorialsEdit from "./TutorialsEdit";
export default function UserProfile(props) {
  return (
    <div className="d-flex flex-row-reverse">
      <div className="card mx-auto" style={{ width: "18rem" }}>
        <img
          src={props.userdata.photoUrl}
          className="card-img-top rounded-circle w-50 mx-auto"
          alt="Profile user pic"
        />
        <div className="card-body text-center">
          <h5 className="card-title">{props.userdata.fullName}</h5>
          <p className="card-text">{props.userdata.email}</p>
          <div className="d-flex flex-column w-50 mx-auto">
            <Link
              to={`/tutorials/${props.userdata.userId}/update/`}
              className="btn btn-primary mb-4"
            >
              My tutorials
            </Link>
            <Logout />
          </div>
        </div>
      </div>
      <div>
        <TutorialsEdit userId={props.userdata.userId} />
      </div>
    </div>
  );
}
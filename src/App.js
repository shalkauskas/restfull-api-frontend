import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route, Link } from "react-router-dom";
import Logout from "./components/Logout";
import { isLogin } from "./utils/refreshToken";
import Index from "./components/Index";
import AddTutorial from "./components/AddTutorial";
import Tutorial from "./components/Tutorial";
import TutorialsList from "./components/TutorialsList";
import TutorialsEdit from "./components/TutorialsEdit";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import React from "react";
import AuthService from "./services/AuthService";
import NotFound from "./components/NotFound";
import UserProfile from "./components/UserProfile";
export default function App() {
  const [userdata, setUserdata] = React.useState([]);
  React.useEffect(() => {
    if (isLogin()) {
      console.log("logged in");
      AuthService.index()
        .then((response) => {
          setUserdata(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to="/" className="navbar-brand">
          Web Development Tutorials
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/tutorials"} className="nav-link">
              Tutorials
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              Add
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={`/tutorials/${userdata.userId}/update/`}
              className="nav-link"
            >
              Edit
            </Link>
          </li>
        </div>
        <div className="navbar-nav ml-auto">
          <Link to={`/${userdata.userId}`} className="nav-link">
            <img
              src={userdata.photoUrl}
              alt="user profile pic"
              width="35px"
              height="35px"
              className={`${
                isLogin() ? "" : "d-none"
              } rounded-circle mr-3 my-auto`}
            />
          </Link>
          <li className="nav-item">
            {isLogin() ? (
              <Link to={"/signout"} className="nav-link">
                Logout
              </Link>
            ) : (
              <Link to={"/signin"} className="nav-link">
                Log in
              </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={"/"} component={Index} />
          <Route exact path={"/tutorials"} component={TutorialsList} />
          <Route
            exact
            path="/add"
            render={(props) => (
              <AddTutorial
                {...props}
                author={userdata.fullName}
                userId={userdata.userId}
              />
            )}
          />
          {/* <Route path="/tutorials/update/:id" component={Tutorial} /> */}
          <Route exact path="/signin" component={Login} />
          <Route exact path="/signout" component={Logout} />
          <PrivateRoute
            path={`/tutorials/${userdata.userId}/update/:id`}
            component={Tutorial}
            author={userdata.fullName}
            userId={userdata.userId}
            exact
          />
          <PrivateRoute
            path={`/tutorials/${userdata.userId}/update/`}
            component={TutorialsEdit}
            author={userdata.fullName}
            userId={userdata.userId}
          />
          <PrivateRoute
            path={`/${userdata.userId}`}
            component={UserProfile}
            userdata={userdata}
            exact
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

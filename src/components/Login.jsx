import React from "react";
import { GoogleLogin } from "react-google-login";
import { useHistory } from "react-router-dom";
// refresh token
import { refreshTokenSetup } from "../utils/refreshToken";

export default function Login() {
  const clientId = process.env.REACT_APP_clientId;
  const history = useHistory();
  const onSuccess = (res) => {
    const token = res.getAuthResponse().id_token;
    console.log("Login Success: currentUser:", res.profileObj);
    alert(
      `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    );
    localStorage.setItem("loggedin", token);
    //     console.log(localStorage.getItem("loggedin"));
    history.push("/tutorials");
    history.go(0);
    refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
    alert(`Failed to login.`);
  };

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
      isSignedIn={true}
      cookiePolicy={"single_host_origin"}
    />
  );
}

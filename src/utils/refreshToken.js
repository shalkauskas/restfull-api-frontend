export const refreshTokenSetup = (res) => {
  // Timing to renew access token
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
    console.log("newAuthRes:", newAuthRes);
    //  <-- save new token
    // saveUserToken(newAuthRes.access_token);
    localStorage.setItem(`loggedin`, newAuthRes.id_token);
    // Setup the other timer after the first one
    setTimeout(refreshToken, refreshTiming);
  };

  // Setup first refresh timer
  setTimeout(refreshToken, refreshTiming);
};

export const isLogin = () => {
  const checkStorage = localStorage.getItem("loggedin");
  if (checkStorage) {
    return true;
  }
  return false;
};

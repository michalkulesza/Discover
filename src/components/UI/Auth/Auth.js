import React, { useEffect } from "react";
import "./Auth.css";

const clientId = "4e37454500dc4f868a681773f987e18e";
const redirectUrl = "http://localhost:3000/";
const scope = ["user-read-private", "user-read-email"];

const Auth = props => {
  useEffect(() => {
    let hashUrl = window.location.hash.substring(14).split("&")[0];
    console.log(hashUrl);
  });

  if (props.token) {
    return null;
  } else {
    return (
      <div className="wrapper centerXY authWrapper">
        <div className="authContainer">
          <a
            className="loginButton"
            href={`https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}&response_type=token&state=123`}
          >
            LOGIN TO SPOTIFY
          </a>
          <span>Spotify premium account is required for this app to work.</span>
        </div>
      </div>
    );
  }
};

export default Auth;

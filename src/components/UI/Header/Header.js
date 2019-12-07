import React from "react";
import TextLoop from "react-text-loop";
import "./Header.css";

const Header = props => {
  return (
    <>
      <div className="header-container">
        <img src={props.artists[0].images[0].url} alt="" />
        <div className="header-inner-container">
          <div>
            <div id="small-logo">DISCOVER</div>
            <p>{props.artists[0].name.toUpperCase()}</p>
            <div id="genre">
              <TextLoop mask={true}>
                {props.artists[0].genres.map(item => {
                  return item;
                })}
              </TextLoop>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

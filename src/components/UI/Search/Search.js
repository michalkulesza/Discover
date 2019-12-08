import React from "react";
import "./Search.css";

const Search = props => {
  return (
    <div className="wrapper centerXY">
      <form id="main-form" onSubmit={props.getArtists}>
        <input id="main-input" type="text" placeholder="Artist" defaultValue="eminem" />
        <button id="main-button">Search</button>
      </form>
    </div>
  );
};

export default Search;

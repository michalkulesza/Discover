import React from "react";
import "./Search.css";

const Search = props => {
  return (
    <div className="wrapper centerXY">
      <form id="main-form" onSubmit={props.getArtists}>
        <input id="main-input" type="text" placeholder="Artist" />
        <button id="main-button">
          {props.searchLoading ? (
            <div className="spinner">
              <i class="fas fa-spinner"></i>
            </div>
          ) : (
            <>Search</>
          )}
        </button>
      </form>
    </div>
  );
};

export default Search;

import React, { useState } from "react";
import "./Songs.css";

const Songs = props => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  return (
    <div className="songs-wrapper">
      {props.songs.map(song => {
        return (
          <div className="song-container" key={song.id}>
            <span className="left">
              <div
                className="song-button-play"
                onClick={() => {
                  if (currentlyPlaying && currentlyPlaying === song.id) {
                    document.getElementById(`${currentlyPlaying}`).pause();
                    setCurrentlyPlaying(null);
                  } else if (currentlyPlaying && document.getElementById(`${currentlyPlaying}`)) {
                    document.getElementById(`${currentlyPlaying}`).pause();
                    document.getElementById(`${song.id}`).play();
                    setCurrentlyPlaying(`${song.id}`);
                  } else {
                    document.getElementById(`${song.id}`).play();
                    setCurrentlyPlaying(`${song.id}`);
                  }
                }}
              >
                {currentlyPlaying && currentlyPlaying === song.id ? (
                  <i className="fas fa-pause" alt="PAUSE"></i>
                ) : (
                  <i className="fas fa-play"></i>
                )}
                <audio id={song.id} src={song.preview_url}></audio>
              </div>
              <div className="song-title">{song.name}</div>
            </span>
            {props.isSongAddedToPlaylist(song.id) ? (
              <span className="right">
                <div className="song-duration"></div>
                <div
                  className="song-button remove"
                  id={song.id}
                  onClick={props.onClickManageSong}
                  status="added"
                >
                  REMOVE
                </div>
              </span>
            ) : (
              <span className="right">
                <div className="song-duration"></div>
                <div
                  className="song-button add"
                  id={song.id}
                  onClick={props.onClickManageSong}
                  status="notAdded"
                >
                  ADD
                </div>
              </span>
            )}
            <div className="progress" style={{}}></div>
          </div>
        );
      })}
    </div>
  );
};

export default Songs;

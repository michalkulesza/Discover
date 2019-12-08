import React from "react";
import "./Carousel.css";

const Carousel = props => {
  function returnId(e) {
    props.onClickArtistGetSongs(e.target.id);
  }

  return (
    <>
      <div className="carousel-container">
        {props.artists.map((artist, index) => {
          return index === 0 ? (
            <div
              className="artist active"
              key={artist.id}
              onClick={e => {
                props.scrollArtistToCenter(e);
                props.setActiveArtistUI(e);
                returnId(e);
              }}
            >
              <div className="black-overlay"></div>
              <img
                src={artist.images[1].url}
                alt={artist.name}
                id={artist.id}
                onClick={e => {
                  returnId(e);
                  props.setActiveArtistUI(e);
                  props.scrollArtistToCenter(e);
                }}
              />
              <p>{artist.name}</p>
            </div>
          ) : (
            <div
              className="artist"
              key={artist.id}
              onClick={e => {
                props.scrollArtistToCenter(e);
                props.setActiveArtistUI(e);
                returnId(e);
              }}
            >
              <div className="black-overlay"></div>
              <img
                src={artist.images[1].url}
                alt={artist.name}
                id={artist.id}
                onClick={e => {
                  returnId(e);
                  props.setActiveArtistUI(e);
                  props.scrollArtistToCenter(e);
                }}
              />
              <p>{artist.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Carousel;

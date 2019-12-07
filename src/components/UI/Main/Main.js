import React from "react";

import Header from "../Header/Header";
import Carousel from "../Carousel/Carousel";
import Songs from "../Songs/Songs";

const Main = props => {
  if (props.token && props.artists && props.songs) {
    return (
      <>
        <Header artists={props.artists} />
        <Carousel
          artists={props.artists}
          onClickArtistGetSongs={props.onClickArtistGetSongs}
          setActiveArtistUI={props.setActiveArtistUI}
          scrollArtistToCenter={props.scrollArtistToCenter}
          onClickSearch={props.onClickSearch}
        />
        <Songs
          songs={props.songs}
          onClickManageSong={props.onClickManageSong}
          isSongAddedToPlaylist={props.isSongAddedToPlaylist}
        />
      </>
    );
  } else {
    return null;
  }
};

export default Main;

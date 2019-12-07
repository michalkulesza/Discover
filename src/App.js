// In onClickAddToPlaylist sort out limit possible issue ?
// Double click add adds song twice
// Artist click outside the picture makes GET req
// Handle axios error bettah
// Fix search on artist image, event inheritance
// Do search on click

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Auth from "./components/UI/Auth/Auth";
import Search from "./components/UI/Search/Search";
import Main from "./components/UI/Main/Main";

const defaultPlaylistName = "Discover APP";
let createdPlaylist = false;

function App() {
  const [artists, setArtists] = useState(null);
  const [songs, setSongs] = useState(null);
  const [existingPlaylistID, setExistingPlaylistID] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [usersTracks, setUsersTracks] = useState(null);
  // eslint-disable-next-line
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (existingPlaylistID && !currentUserID) {
      getAndSetUserID();
    } else if (!existingPlaylistID && !createdPlaylist) {
      //Get users playlists
      axios
        .get(`https://api.spotify.com/v1/me/playlists`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          for (let i = 0; i < res.data.items.length; i++) {
            //If exists set existingPlaylistID
            if (res.data.items[i].name === defaultPlaylistName) {
              setExistingPlaylistID(res.data.items[i].id);
              getUsersTracks(res.data.items[i].id);
              break;
              //If not get user ID
            } else if (i === res.data.items.length - 1) {
              axios
                .get(`https://api.spotify.com/v1/me`, {
                  headers: { Authorization: `Bearer ${token}` }
                })
                //Create playlist
                // eslint-disable-next-line
                .then(res => {
                  setCurrentUserID(res.data.id);
                  axios({
                    method: "post",
                    url: `https://api.spotify.com/v1/users/${res.data.id}/playlists`,
                    headers: { Authorization: `Bearer ${token}` },
                    data: {
                      name: `${defaultPlaylistName}`,
                      public: false,
                      description: "Playlist created by Discover APP"
                    }
                  }).catch(err => {
                    console.log(`Error creating playlist: ${err}`);
                  });
                  createdPlaylist = true;
                })
                .catch(err => {
                  console.log(`Error getting User's ID: ${err}`);
                });
            }
          }
        })
        .catch(err => {
          console.log(`Error getting User's playlists: ${err}`);
        });
    }

    async function getAndSetUserID() {
      await axios
        .get(`https://api.spotify.com/v1/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          setCurrentUserID(res.data.id);
        })
        .catch(err => {
          console.log(`Error getting User's ID: ${err}`);
        });
    }
  });

  async function getArtists(e) {
    let input = document.querySelector("input");
    const form = document.querySelector("#main-form");
    const button = document.querySelector("#main-button");

    const fetchedArtist = await axios
      .get(`https://api.spotify.com/v1/search?q="${input.value}"&type=artist`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        onClickArtistGetSongs(res.data.artists.items[0].id);
        return res;
      })
      .catch(err => {
        console.log(`Error searching for artist: ${err}`);
        form.classList.add("error");
        button.innerHTML = "Cannot find Artist";

        setTimeout(() => {
          button.innerHTML = "LOL";
        }, 1000);
        setTimeout(() => {
          form.classList.remove("error");
          button.innerHTML = "Search";
          input.value = "";
          input.focus();
        }, 2000);
      });

    //If artist name is wrong, return
    if (fetchedArtist === undefined) {
      return false;
    }

    const firstRelatedArtists = await axios
      .get(
        `https://api.spotify.com/v1/artists/${fetchedArtist.data.artists.items[0].id}/related-artists`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch(err => {
        console.log(`Error searching for artist: ${err}`);
      });

    const firstFiveRelatedArtists = firstRelatedArtists.data.artists.slice(0, 5);
    let relatedArtists = [fetchedArtist.data.artists.items[0], ...firstFiveRelatedArtists];

    for (let i = 1; i < 6; i++) {
      await axios
        .get(`https://api.spotify.com/v1/artists/${relatedArtists[i].id}/related-artists`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        // eslint-disable-next-line
        .then(res => {
          for (let j = 0; j < 5; j++) {
            if (!relatedArtists.find(x => x.name === res.data.artists[j].name)) {
              let newArr = [];
              newArr.push(res.data.artists[j]);
              relatedArtists = relatedArtists.concat(newArr);
            }
          }
        });
    }
    setArtists(relatedArtists);
  }

  function onClickArtistGetSongs(id, e) {
    e.stopPropagation();
    axios
      .get(`https://api.spotify.com/v1/artists/${id}/top-tracks?country=from_token`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setSongs(res.data.tracks);
      })
      .catch(err => {
        console.log(`Error getting artists top tracks: ${err}`);
      });
  }

  function getUsersTracks(playlistId) {
    axios
      .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=0&limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUsersTracks(res.data.items);
      })
      .catch(err => {
        console.log(`Error getting user's tracks: ${err}`);
      });
  }

  function addTrackToPlaylist(trackID) {
    axios({
      method: "post",
      url: `https://api.spotify.com/v1/playlists/${existingPlaylistID}/tracks`,
      headers: { Authorization: `Bearer ${token}` },
      data: { uris: [`spotify:track:${trackID}`] }
    })
      .then(() => {
        console.log("Track added to playlist");
        getUsersTracks(existingPlaylistID);
      })
      .catch(err => {
        console.log(`Error adding track to a playlist: ${err}`);
      });
  }

  function removeTrackFromPlaylist(trackID) {
    axios({
      method: "delete",
      url: `https://api.spotify.com/v1/playlists/${existingPlaylistID}/tracks`,
      headers: { Authorization: `Bearer ${token}` },
      data: { uris: [`spotify:track:${trackID}`] }
    })
      .then(() => {
        console.log("Track removed from playlist");
        getUsersTracks(existingPlaylistID);
      })
      .catch(err => {
        console.log(`Error removing track from a playlist: ${err}`);
      });
  }

  function isSongAddedToPlaylist(trackID) {
    if (usersTracks !== null) {
      for (let i = 0; i < usersTracks.length; i++) {
        if (usersTracks[i].track.id === trackID) {
          return true;
        }
      }
    }
  }

  function onClickManageSong(e) {
    if (e.target.getAttribute("status") === "notAdded") {
      addTrackToPlaylist(e.target.id);
    } else if (e.target.getAttribute("status") === "added") {
      removeTrackFromPlaylist(e.target.id);
    }
  }

  function setActiveArtistUI(e) {
    e.stopPropagation();
    if (document.querySelector(".carousel-container").querySelector(".active")) {
      document
        .querySelector(".carousel-container")
        .querySelector(".active")
        .classList.remove("active");
    }
    e.target.parentNode.classList.add("active");
  }

  function scrollArtistToCenter(e) {
    e.stopPropagation();
    let scrollVal = e.target.parentNode.offsetLeft - window.innerWidth / 2 + e.target.width / 2;
    e.target.parentNode.parentNode.scrollTo(scrollVal, 0);
  }

  function onClickSearch() {
    console.log("klick");
  }

  return (
    <>
      <Auth token={token} />
      <Search token={token} artists={artists} getArtists={getArtists} />
      <Main
        token={token}
        artists={artists}
        onClickArtistGetSongs={onClickArtistGetSongs}
        songs={songs}
        onClickManageSong={onClickManageSong}
        isSongAddedToPlaylist={isSongAddedToPlaylist}
        setActiveArtistUI={setActiveArtistUI}
        scrollArtistToCenter={scrollArtistToCenter}
        onClickSearch={onClickSearch}
      />
    </>
  );
}

export default App;

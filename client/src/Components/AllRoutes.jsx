import React, { useState } from "react";
import Home from "../Pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import Library from "../Pages/Library/Library";
import YourVideo from "../Pages/YourVideo/YourVideo";
import WatchHistory from "../Pages/WatchHistory/WatchHistory";
import WatchLater from "../Pages/WatchLater/WatchLater";
import LikedVideo from "../Pages/LikedVideo/LikedVideo";
import VideoPage from "../Pages/VideoPage/VideoPage";
import Chanel from "../Pages/Chanel/Chanel";
import Search from "../Pages/Search/Search";
import RoomPage from "./Room";
function AllRoutes({ points, setPoints, setEditCreateChanelBtn, setVidUploadPage }) {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library" element={<Library />} />
      <Route path="/history" element={<WatchHistory />} />
      <Route path="/watchlater" element={<WatchLater />} />
      <Route path="/likedvideo" element={<LikedVideo />} />
      <Route path="/yourvideos" element={<YourVideo />} />
      <Route path="/videopage/:vid" element={<VideoPage points={points} setPoints={setPoints}/>} />
      <Route path="/seacrh/:searchQuery" element={<Search />} />
      <Route
        path="/chanel/:Cid"
        element={<Chanel 
          points={points} setPoints={setPoints}
          setVidUploadPage={setVidUploadPage}
          setEditCreateChanelBtn={setEditCreateChanelBtn} />}
      />
      <Route path="/room/:roomId" element={<RoomPage />} />
    </Routes>
  );
}

export default AllRoutes;

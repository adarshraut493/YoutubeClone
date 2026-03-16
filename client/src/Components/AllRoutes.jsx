import React from "react";
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
import RoomPage from "../Components/Room/RoomPage";
import Shorts from "../Pages/Shorts/Shorts";
import Explore from "../Pages/Explore/Explore";
import Subscriptions from "../Pages/Subscriptions/Subscriptions";

function AllRoutes({ setEditCreateChanelBtn, setVidUploadPage }) {
  return (
    <Routes>
      <Route path="/" element={<Home setVidUploadPage={setVidUploadPage}/>} />
      <Route path="/shorts" element={<Shorts />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/subscriptions" element={<Subscriptions />} />
      <Route path="/library" element={<Library />} />
      <Route path="/history" element={<WatchHistory />} />
      <Route path="/watchlater" element={<WatchLater />} />
      <Route path="/likedvideo" element={<LikedVideo />} />
      <Route path="/yourvideos" element={<YourVideo />} />
      <Route path="/videopage/:vid" element={<VideoPage />} />
      <Route path="/seacrh/:searchQuery" element={<Search />} />
      <Route
        path="/chanel/:Cid"
        element={<Chanel
          setVidUploadPage={setVidUploadPage}
          setEditCreateChanelBtn={setEditCreateChanelBtn} />}
      />
      <Route path="/room/:roomId" element={<RoomPage />} />
    </Routes>
  );
}

export default AllRoutes;

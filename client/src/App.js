import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "./Components/Navbar/Navbar";
import AllRoutes from "./Components/AllRoutes";
import DrawerSidebar from "./Components/LeftSidebar/DrawerSidebar";
import CreateEditChanel from "./Pages/Chanel/CreateEditChanel";
import VideoUpload from "./Pages/VideoUpload/VideoUpload";
import { fetchAllChanel } from "./actions/chanelUser";
import { getAllVideo } from "./actions/video";
import { getAlllikedVideo } from "./actions/likedVideo";
import { getAllwatchLater } from "./actions/watchLater";
import { getAllHistory } from "./actions/History";
import { setCurrentUser } from "./actions/currentUser";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('Profile'));
    if (profile) {
      dispatch(setCurrentUser(profile));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllChanel());
    dispatch(getAllVideo());
    dispatch(getAlllikedVideo());
    dispatch(getAllwatchLater());
    dispatch(getAllHistory());
  }, [dispatch]);

  useEffect(() => {
    const isTabOpened = sessionStorage.getItem('isTabOpened');
    if (!isTabOpened) {
      sessionStorage.setItem('isTabOpened', 'true');
      window.open(window.location.href, '_blank'); // Open a new tab in the background
    }
  }, []);


  const [toggleDrawerSidebar, setToggleDrawerSidebar] = useState({
    display: "none",
  });

  const toggleDrawer = () => {
    setToggleDrawerSidebar({
      display: toggleDrawerSidebar.display === "none" ? "flex" : "none",
    });
  };

  const [points, setPoints] = useState(0);
  const [vidUploadPage, setVidUploadPage] = useState(false);
  const [EditCreateChanelBtn, setEditCreateChanelBtn] = useState(false);

  return (
    <Router>
      {vidUploadPage && <VideoUpload setVidUploadPage={setVidUploadPage} />}
      {EditCreateChanelBtn && (
        <CreateEditChanel setEditCreateChanelBtn={setEditCreateChanelBtn} />
      )}

      <Navbar
        setEditCreateChanelBtn={setEditCreateChanelBtn}
        toggleDrawer={toggleDrawer}
        points={points}
        setPoints={setPoints}
        setVidUploadPage={setVidUploadPage}
      />

      <DrawerSidebar
        toggleDrawer={toggleDrawer}
        toggleDrawerSidebar={toggleDrawerSidebar}
      />

      <AllRoutes
        points={points}
        setPoints={setPoints}
        setVidUploadPage={setVidUploadPage}
        setEditCreateChanelBtn={setEditCreateChanelBtn}
      />
    </Router>
  );
}

export default App;

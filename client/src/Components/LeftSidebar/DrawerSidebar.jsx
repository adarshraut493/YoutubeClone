import React from "react";
import "./LeftSidebar.css";

import { AiFillPlaySquare, AiOutlineHome, AiFillLike } from "react-icons/ai";
import {
  MdOutlineExplore,
  MdOutlineVideoLibrary,
  MdOutlineWatchLater,
  MdSubscriptions,
} from "react-icons/md";
import { FaHistory } from "react-icons/fa";

import shorts from "./shorts.png";
import { NavLink } from "react-router-dom";

function DrawerSidebar({ toggleDrawer,toggleDrawerSidebar }) {
  return (
    <div className="container_DrawaerLeftSidebar" style={toggleDrawerSidebar}>
      <div className="container2_DrawaerLeftSidebar">
        <div className="Drawer_leftsidebar">
          <NavLink to={'/'} className="icon_sidebar_div" onClick={() => toggleDrawer()}>
            <p>
              <AiOutlineHome size={22} className="icon_sidebar" />
              <div className="text_sidebar_icon">Home</div>
            </p>
          </NavLink>
          <NavLink to={'/explore'} className="icon_sidebar_div" onClick={() => toggleDrawer()}>
            <p>
              <MdOutlineExplore size={22} className="icon_sidebar" />
              <div className="text_sidebar_icon">Explore</div>
            </p>
          </NavLink>
          <NavLink to={'/shorts'} className="icon_sidebar_div" onClick={() => toggleDrawer()}>
            <p>
              <img src={shorts} width={22} className="icon_sidebar" alt="shorts" />
              <div className="text_sidebar_icon">Shorts</div>
            </p>
          </NavLink>
          <NavLink to={'/subscriptions'} className="icon_sidebar_div" onClick={() => toggleDrawer()}>
            <p>
              <MdSubscriptions size={22} className="icon_sidebar" />
              <div className="text_sidebar_icon">Subscriptions</div>
            </p>
          </NavLink>
        </div>
        <div className="libraryBtn_Drawerleftsidebar">
          <NavLink to={'/library'} className="icon_sidebar_div" onClick={() => toggleDrawer()}>
            <p>
              <MdOutlineVideoLibrary size={22} className="icon_sidebar" />
              <div className="text_sidebar_icon">Library</div>
            </p>
          </NavLink>
          <NavLink to={'/history'} className="icon_sidebar_div" onClick={() => toggleDrawer()}>
            <p>
              <FaHistory size={22} className="icon_sidebar" />
              <div className="text_sidebar_icon">History</div>
            </p>
          </NavLink>
          <NavLink to={'/yourvideos'} className="icon_sidebar_div" onClick={() => toggleDrawer()}>
            <p>
              <AiFillPlaySquare size={22} className="icon_sidebar" />
              <div className="text_sidebar_icon">Your Videos</div>
            </p>
          </NavLink>
          <NavLink to={'/watchlater'} className="icon_sidebar_div" onClick={() => toggleDrawer()}>
            <p>
              <MdOutlineWatchLater size={22} className="icon_sidebar" />
              <div className="text_sidebar_icon">Watch Later</div>
            </p>
          </NavLink>
          <NavLink to={'/likedvideo'} className="icon_sidebar_div" onClick={() => toggleDrawer()}>
            <p>
              <AiFillLike size={22} className="icon_sidebar" />
              <div className="text_sidebar_icon">Liked Videos</div>
            </p>
          </NavLink>
        </div>
        <div className="subScriptions_lsdbar">
          <h3>Your Subscriptions</h3>
          <div className="chanel_lsdbar">
            <p>C</p>
            <div>Chanel</div>
          </div>
          <div className="chanel_lsdbar">
            <p>C</p>
            <div>Chanel</div>
          </div>
          <div className="chanel_lsdbar">
            <p>C</p>
            <div>Chanel</div>
          </div>
          <div className="chanel_lsdbar">
            <p>C</p>
            <div>Chanel</div>
          </div>
        </div>
      </div>
      <div
        className="container3_DrawaerLeftSidebar"
        onClick={() => toggleDrawer()}
      ></div>
    </div>
  );
}

export default DrawerSidebar;

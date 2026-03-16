import React, { useState, useEffect, useCallback } from "react";
import "./Navbar.css";
import logo from "./logo.ico";
import SearchBar from "./SearchBar/SearchBar";
import { RiVideoAddLine } from "react-icons/ri";
import { BiUserCircle } from "react-icons/bi";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { gapi } from "gapi-script";
import { Link, useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";
import Auth from "../../Pages/Auth/Auth";

function Navbar({ toggleDrawer, setEditCreateChanelBtn, setVidUploadPage }) {
  const [AuthBtn, setAuthBtn] = useState(false);
  const CurrentUser = useSelector((state) => state.currentUserReducer);

  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 1 && currentHour < 24) {
      setShowInput(true);
    } else {
      setShowInput(false);
      window.alert("We can do video calls only between 6 PM and 12 AM.");
    }
  };

  
  const [value, setValue] = useState("");

  const handleJoinRoom = useCallback(() => {
    navigate(`/room/${value}`);
  }, [navigate, value]);

  const clientId = "810354537421-ohdp6388hgpfbnu5r5s49g7ad9gfc1fo.apps.googleusercontent.com";

  useEffect(() => {
    const start = () => {
      gapi.load("auth2", () => {
        gapi.auth2
          .init({ client_id: clientId })
          .then(() => console.log("Google API initialized"))
          .catch((err) => console.error("Google API init error", err));
      });
    };
    start();
  }, []);
  

  const dispatch = useDispatch();

  const onSuccess = (response) => {
    console.log("Login Success:", response);
    const decoded = jwtDecode(response.credential);
    const Email = decoded.email;
    dispatch(login({ email: Email }));
  };
  
  const onFailure = (response) => {
    console.log("Login Failed:", response);
  };
  

  return (
    <>
      <div className="Container_Navbar">
        <div className="Burger_Logo_Navbar">
          <div className="burger" onClick={() => toggleDrawer()}>
            <p></p>
            <p></p>
            <p></p>
          </div>

          <Link to={"/"} className="logo_div_Navbar">
            <img src={logo} alt="logo" />
            <p className="logo_title_navbar">YouTube</p>
          </Link>
        </div>
        
        <SearchBar />
        
        <div className="right_navbar_container">
          <RiVideoAddLine onClick={handleClick} size={24} className="vid_bell_Navbar" title="Create room" />
          
          <IoMdNotificationsOutline size={24} className="vid_bell_Navbar" title="Notifications" />

          <div className="Auth_cont_Navbar">
            {CurrentUser ? (
              <div className="Chanel_logo_App" onClick={() => setAuthBtn(true)}>
                <p className="fstChar_logo_App">
                  {CurrentUser?.result.name ? (
                    <>{CurrentUser?.result.name.charAt(0).toUpperCase()}</>
                  ) : (
                    <>{CurrentUser?.result.email.charAt(0).toUpperCase()}</>
                  )}
                </p>
              </div>
            ) : (
              <GoogleOAuthProvider clientId={clientId}>
                <div onClick={() => document.querySelector('[role="button"]')?.click()} className="custom_signin_btn">
                  <BiUserCircle size={24} />
                  <span>Sign in</span>
                </div>
                <div style={{ display: 'none' }}>
                  <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                    useOneTap={false}
                  />
                </div>
              </GoogleOAuthProvider>
            )}
          </div>
        </div>
      </div>
      
      {showInput && (
        <div className="room_modal_overlay" onClick={() => setShowInput(false)}>
          <div className="room_modal" onClick={(e) => e.stopPropagation()}>
            <h3>Join Video Room</h3>
            <input
              className="room_input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter Room Code"
              autoFocus
            />
            <div className="room_modal_actions">
              <button className="btn_cancel" onClick={() => setShowInput(false)}>Cancel</button>
              <button className="btn_join" onClick={handleJoinRoom}>Join Room</button>
            </div>
          </div>
        </div>
      )}
      
      {AuthBtn && (
        <Auth
          User={CurrentUser}
          setAuthBtn={setAuthBtn}
          setEditCreateChanelBtn={setEditCreateChanelBtn}
        />
      )}
    </>
  );
}

export default Navbar;

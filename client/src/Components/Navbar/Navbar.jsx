import React, { useState, useCallback } from "react";
import "./Navbar.css";
import logo from "./logo.ico";
import SearchBar from "./SearchBar/SearchBar";
import { RiVideoAddLine } from "react-icons/ri";
import { BiUserCircle } from "react-icons/bi";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";
import Auth from "../../Pages/Auth/Auth";

function Navbar({ toggleDrawer, setEditCreateChanelBtn }) {
  const [AuthBtn, setAuthBtn] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state.currentUserReducer);

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

  const handleJoinRoom = useCallback(() => {
    navigate(`/room/${value}`);
  }, [navigate, value]);

  const clientId = "810354537421-ohdp6388hgpfbnu5r5s49g7ad9gfc1fo.apps.googleusercontent.com";

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        console.log("User Info:", userInfo);

        if (userInfo.email) {
          dispatch(login({ email: userInfo.email }));
        } else {
          console.error("Email not found in Google response");
        }
      } catch (error) {
        console.error("Error fetching Google user info:", error);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="Container_Navbar">
        <div className="Burger_Logo_Navbar">
          <div className="burger" onClick={toggleDrawer}>
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

        <RiVideoAddLine onClick={handleClick} size={22} className="vid_bell_Navbar" />
        {showInput && (
          <div>
            <input
              className="join"
              type="text"
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter Room Code"
            />
            <button onClick={handleJoinRoom}>Join</button>
          </div>
        )}

        <IoMdNotificationsOutline size={22} className="vid_bell_Navbar" />

        <div className="Auth_cont_Navbar">
          {CurrentUser ? (
            <div className="Chanel_logo_App" onClick={() => setAuthBtn(true)}>
              <p className="fstChar_logo_App">
                {CurrentUser?.result.name
                  ? CurrentUser.result.name.charAt(0).toUpperCase()
                  : CurrentUser?.result.email.charAt(0).toUpperCase()}
              </p>
            </div>
          ) : (
            <button className="Auth_Btn" onClick={loginWithGoogle}>
              <BiUserCircle size={20} />
              Sign
            </button>
          )}
        </div>
      </div>

      {AuthBtn && <Auth User={CurrentUser} setAuthBtn={setAuthBtn} setEditCreateChanelBtn={setEditCreateChanelBtn} />}
    </GoogleOAuthProvider>
  );
}

export default Navbar;

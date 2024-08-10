import React from "react";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setCurrentUser } from "../../actions/currentUser";
import "./Auth.css";

function Auth({ User, setAuthBtn, setEditCreateChanelBtn }) {
  const dispatch = useDispatch();

  const onLogOut = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      dispatch(setCurrentUser(null));
      alert("Logged Out Successfully");
    });
  };

  const userName = User?.result?.name;
  const userEmail = User?.result?.email;
  const userId = User?.result?._id;
  const firstChar = userName?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase() || '';

  return (
    <div className="Auth_container" onClick={() => setAuthBtn(false)}>
      <div className="Auth_container2" onClick={(e) => e.stopPropagation()}>
        <div className="User_Details">
          <div className="Chanel_logo_App">
            <p className="fstChar_logo_App">
              {firstChar}
            </p>
          </div>
          <div className="email_Auth">{userEmail}</div>
        </div>
        <div className="btns_Auth">
          {userName ? (
            <Link to={`/chanel/${userId}`} className="btn_Auth">
              Your Channel
            </Link>
          ) : (
            <input
              type="submit"
              className="btn_Auth"
              value="Create Your Channel"
              onClick={() => setEditCreateChanelBtn(true)}
            />
          )}
          <div onClick={onLogOut} className="btn_Auth">
            <BiLogOut />
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

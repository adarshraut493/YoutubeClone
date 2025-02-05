import React from "react";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setCurrentUser } from "../../actions/currentUser";
import "./Auth.css";

function Auth({ User, setAuthBtn, setEditCreateChanelBtn }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    localStorage.removeItem("profile"); // Clear user session
    alert("Logged Out Successfully");
  };

  return (
    <div className="Auth_container" onClick={() => setAuthBtn(false)}>
      <div className="Auth_container2">
        <p className="User_Details">
          <div className="Chanel_logo_App">
            <p className="fstChar_logo_App">
              {User?.result?.name
                ? User.result.name.charAt(0).toUpperCase()
                : User?.result?.email.charAt(0).toUpperCase()}
            </p>
          </div>
          <div className="email_Auth">{User?.result?.email}</div>
        </p>

        <div className="btns_Auth">
          {User?.result?.name ? (
            <Link to={`/chanel/${User?.result?._id}`} className="btn_Auth">
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

          <div onClick={handleLogout} className="btn_Auth">
            <BiLogOut />
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

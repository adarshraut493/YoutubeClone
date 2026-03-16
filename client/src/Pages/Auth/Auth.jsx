import React from "react";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setCurrentUser } from "../../actions/currentUser";
import "./Auth.css";

function Auth({ User, setAuthBtn, setEditCreateChanelBtn }) {
  const dispatch = useDispatch();

  const onLogOutSuccess = () => {
    dispatch(setCurrentUser(null));
    localStorage.removeItem('Profile');
    setAuthBtn(false);
  };

  return (
    <div className="Auth_container" onClick={() => setAuthBtn(false)}>
      <div className="Auth_container2" onClick={(e) => e.stopPropagation()}>
        <div className="User_Details">
          <div className="Chanel_logo_App">
            <p className="fstChar_logo_App">
              {User?.result.name
                ? User?.result.name.charAt(0).toUpperCase()
                : User?.result.email.charAt(0).toUpperCase()}
            </p>
          </div>
          <div className="email_Auth">
            <div style={{ fontWeight: 500, color: '#fff', marginBottom: 2 }}>
              {User?.result.name || "User"}
            </div>
            <div>{User?.result.email}</div>
          </div>
        </div>
        <div className="btns_Auth">
          {User?.result.name ? (
            <Link to={`/chanel/${User?.result._id}`} className="btn_Auth" onClick={() => setAuthBtn(false)}>
              Your Channel
            </Link>
          ) : (
            <button
              type="button"
              className="btn_Auth"
              onClick={() => { setEditCreateChanelBtn(true); setAuthBtn(false); }}
            >
              Create Your Channel
            </button>
          )}
          <div onClick={onLogOutSuccess} className="btn_Auth">
            <BiLogOut />
            Sign Out
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

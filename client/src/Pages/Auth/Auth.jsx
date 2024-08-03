import React from "react";
import { GoogleLogout } from "react-google-login";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setCurrentUser } from "../../actions/currentUser";
import "./Auth.css";

function Auth({ User, setAuthBtn, setEditCreateChanelBtn }) {
  const dispatch = useDispatch();

  const onLogOutSuccess = () => {
    dispatch(setCurrentUser(null));
    alert("Logged Out Successfully");
  };

  // Extract User details safely
  const userName = User?.result?.name;
  const userEmail = User?.result?.email;
  const userId = User?.result?._id;

  // Safe retrieval of the first character from userName or userEmail
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

          <div>
            <GoogleLogout
              clientId="810354537421-ohdp6388hgpfbnu5r5s49g7ad9gfc1fo.apps.googleusercontent.com"
              onLogoutSuccess={onLogOutSuccess}
              render={(renderProps) => (
                <div
                  onClick={renderProps.onClick}
                  className="btn_Auth"
                  disabled={renderProps.disabled}
                >
                  <BiLogOut />
                  Log Out
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

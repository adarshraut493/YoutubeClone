import React from "react";
import { useSelector } from "react-redux";
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar";
import ShowVideoGrid from "../../Components/ShowVideoGrid/ShowVideoGrid";

// import vid from "../../Components/Video/vid.mp4";
import "./Home.css";

function Home({ setVidUploadPage = { setVidUploadPage } }) {

  const vids = useSelector(state => state.videoReducer)?.data?.filter(q => q).reverse();
  

  const NavList = [
    "All",
    "Python",
    "Java",
    "C++",
    "Movies",
    "Science",
    "Animation",
    "Gaming",
    "Comedy",
  ];
  return (
    <div className="container_Pages_App">
      <LeftSidebar />
      <div className="container2_Pages_App">
        <div className="navigation_Home">
          {NavList.map((m) => {
            return (
              <p key={m} className="btn_nav_home">
                {m}
              </p>
            );
          })}
        </div>

        <ShowVideoGrid vids={vids} setVidUploadPage={setVidUploadPage} />
      </div>
    </div>
  );
}

export default Home;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import ShowVideoGrid from "../../Components/ShowVideoGrid/ShowVideoGrid";
import "./Home.css";

function Home({ setVidUploadPage }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const allVids = useSelector(state => state.videoReducer)?.data;

  const NavList = ["All", "Python", "Java", "C++", "Movies", "Science", "Animation", "Gaming", "Comedy"];

  const vids = activeCategory === "All"
    ? [...(allVids || [])].reverse()
    : [...(allVids || [])].filter(v =>
        v?.videoTitle?.toLowerCase().includes(activeCategory.toLowerCase())
      ).reverse();

  return (
    <div>
      <div className="navigation_Home">
        {NavList.map((m) => (
          <p
            key={m}
            className={`btn_nav_home ${activeCategory === m ? "btn_nav_home_active" : ""}`}
            onClick={() => setActiveCategory(m)}
          >
            {m}
          </p>
        ))}
      </div>
      <ShowVideoGrid vids={vids} setVidUploadPage={setVidUploadPage} />
    </div>
  );
}

export default Home;

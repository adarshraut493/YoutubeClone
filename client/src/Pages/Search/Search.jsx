import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ShowVideoGrid from "../../Components/ShowVideoGrid/ShowVideoGrid";

function Search() {
  const { searchQuery } = useParams();
  const vids = useSelector((state) => state.videoReducer)
    ?.data?.filter((q) => q?.videoTitle.toUpperCase().includes(searchQuery.toUpperCase()))
    .reverse();

  return (
    <div>
      <h2 style={{ color: "white", padding: "24px" }}>Search Results for "{searchQuery}"</h2>
      <ShowVideoGrid vids={vids} />
    </div>
  );
}

export default Search;

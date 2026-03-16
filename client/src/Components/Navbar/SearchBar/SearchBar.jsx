import React from "react";
import "./SearchBar.css";
import { BsMicFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import SearchList from "./SearchList";
import {useState} from 'react'
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
function SearchBar() {
  // searchQuery State: Tracks the user's search input.
  const [searchQuery, setSearchQuery] = useState("");
const [seachListA, setSeachList] = useState(false)
// TitleArray: Filters video titles in videoReducer to only show those matching the searchQuery.
const TitleArray = useSelector(s=>s?.videoReducer)
?.data?.filter(q=> q?.videoTitle.toUpperCase().includes(searchQuery?.toUpperCase())).map(m=>m?.videoTitle)
// console.log(TitleArray)
// const TitleArray=["video1","Video2","Animation video","Movies"].filter(q=>q.toUpperCase().includes(searchQuery.toUpperCase()));
 return (
    <>
      <div className="SearchBar_Container">
        <div className="SearchBar_Container2">
          <div className="search_div">
            <input type="text" className="iBox_SearchBar" placeholder="Search" 
              onChange={e=>setSearchQuery(e.target.value)}
              value={searchQuery}
              onClick={e=>setSeachList(true)}
            />
            <Link to={`/seacrh/${searchQuery}`}>
              <FaSearch className="searchIcon_SearchBar" 
              onClick={e=>setSeachList(false)}
            />
            </Link>
            {/* Search Suggestions (SearchList Component): When the user starts typing, the SearchList component shows filtered video titles. Clicking on a suggestion updates the search input with the selected title. */}
            <BsMicFill className="Mic_SearchBar" />
            {searchQuery&& seachListA &&
              <SearchList
              setSearchQuery={setSearchQuery}
              TitleArray={TitleArray}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchBar;

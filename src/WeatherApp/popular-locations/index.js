import { React, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./index.css";
import { IoCloseCircle } from "react-icons/io5";

function PopularLocations(props) {
  const locations = [
    "Los Angeles, California",
    "Atlanta, Georgia",
    "Philadelphia, Pennsylvania",
    "Denver, Colorado",
    "Dallas, Texas",
    "Seattle, Washington",
  ];

  return (
    <>
      <div className="center-text siderbar-label mt-4 mb-2">Popular Places</div>
      <ul className="list-group bookmark-list">
        {locations.map((b, index) => (
          <li className="list-group-item bookmark-item mb-2 pt-3 pb-3">
            <Link to={`/details/${b}`}>{b}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
export default PopularLocations;

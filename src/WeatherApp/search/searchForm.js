import "./index.css";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
// import cities from "./city_db.json";
import * as client from "./client";
import { IoWater } from "react-icons/io5";
import { FaThermometerHalf } from "react-icons/fa";
import { FaWind } from "react-icons/fa";
import { FiWind } from "react-icons/fi";
import { WiHumidity } from "react-icons/wi";
import { RiMistFill } from "react-icons/ri";

function SearchForm() {
  const MAX_RETRIES = 5;
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [forecastArray, setForecastArray] = useState([]);
  const [showLoadAnim, setShowLoadAnim] = useState(false);
  const element = document.getElementById("searchbar");

  useEffect(() => {
    const getCitySearchList = async () => {
      const res = await client.getCities();
      const cities = await res[0].list;
      setCities(cities);
      setFilteredCities(cities);
    };
    getCitySearchList();
  }, []);

  const [searchText, setSearchText] = useState({
    text: "",
  });

  useEffect(() => {
    const matches = cities.filter((city) =>
      city.toLowerCase().includes(searchText.text.toLowerCase())
    );
    setFilteredCities(matches);
  }, [searchText]);

  const clickCity = (e) => {
    setSearchText({ text: e.target.innerHTML });
    element.focus();
  };

  const submitForm = (e) => {
    if (e.key === "Enter") {
      console.log("Search Initiated");
      navigate(`/search/${searchText.text}`);
    }
  };

  return (
    <div className="main-container mt-4">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
        <div className="input-group mb-3">
          <h3 className="">Location Search</h3>
          <div className="dropdown mt-4">
            <input
              type="text"
              className="form-control dropdown-toggle w-75"
              id="searchbar"
              data-bs-toggle="dropdown"
              placeholder="Boston, MA"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={searchText.text}
              onChange={(e) =>
                setSearchText({ ...searchText, text: e.target.value })
              }
              onKeyDown={submitForm}
            />
            <Link to={`/search/${searchText.text}`}>
              <button
                className="btn btn-outline-secondary ms-2 signup-btn mb-1"
                type="button"
              >
                Search
              </button>
            </Link>
            <ul className="dropdown-menu" aria-labelledby="searchbar">
              {filteredCities.map((item, index) => (
                <li
                  onClick={clickCity}
                  className="dropdown-item suggestion"
                  key={index}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {showLoadAnim ? (
          <div className="center">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SearchForm;

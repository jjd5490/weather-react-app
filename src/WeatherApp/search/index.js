import "./index.css";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
// import cities from "./city_db.json";
import * as client from "./client";
import { IoWater } from "react-icons/io5";
import { FaThermometerHalf } from "react-icons/fa";
import { FaWind } from "react-icons/fa";
import { FiWind } from "react-icons/fi";
import { WiHumidity } from "react-icons/wi";
import { RiMistFill } from "react-icons/ri";

function Search() {
  const MAX_RETRIES = 5;

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

  const searchForCities = async () => {
    setShowLoadAnim(true);
    setSearchResults([]);

    const response = await client.partialMatchCities(searchText.text);

    console.log("Response");
    console.log(response);
    // setForecastArray([]);
    var tempArray = [];
    for (var i = 0; i < response.length; i++) {
      const lat = Math.round(
        (parseFloat(response[i].latitude) * 100) / 100.0
      ).toFixed(0);
      const long = Math.round(
        (parseFloat(response[i].longitude) * 100) / 100.0
      ).toFixed(0);

      const currentConditions = await client.getCurrentConditions(lat, long);
      console.log(currentConditions);
      tempArray.push(currentConditions);
    }
    setForecastArray(tempArray);
    // const lat = response[0].latitude;
    // const long = response[0].longitude;
    // const currentConditions = await client.getCurrentConditions(lat, long);
    // setForecastArray([currentConditions, currentConditions, currentConditions]);
    setSearchResults(response);
    setShowLoadAnim(false);
  };

  const submitForm = (e) => {
    if (e.key === "Enter") {
      console.log("Search Initiated");
      searchForCities();
    }
  };

  return (
    <div className="main-container mt-4">
      <div className="col-6">
        <div className="input-group mb-3">
          <div className="dropdown">
            <input
              type="text"
              className="form-control dropdown-toggle w-50"
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
            <button
              className="btn btn-outline-secondary ms-2 signup-btn mb-1"
              type="button"
              onClick={searchForCities}
            >
              Search
            </button>
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

        <ul className="list-group">
          {searchResults.map((city, index) => (
            <li className="list-group-item mb-3 search-result" key={index}>
              <Link to={`/details/${city.cityID}`}>
                <div className="row">
                  <div className="col-3">
                    <div className="location">{city.cityID}</div>
                    <div>{forecastArray[index].shortForecast}</div>
                    <div className="coordinates mt-1">
                      {(
                        Math.round(Math.abs(city.latitude) * 100) / 100
                      ).toFixed(3)}
                      &deg; {city.latitude > 0 ? "N" : "S"},{" "}
                      {(
                        Math.round(Math.abs(city.longitude) * 100) / 100
                      ).toFixed(3)}
                      &deg; {city.longitude > 0 ? "E" : "W"}
                    </div>
                  </div>
                  {forecastArray.length > 0 ? (
                    <>
                      <div className="col center-text">
                        <div>
                          <div>
                            <FaThermometerHalf className="weather-icon" />
                          </div>
                          <div className="measurement">
                            {forecastArray[index].temperature}&deg;F
                          </div>
                        </div>
                      </div>
                      <div className="col center-text">
                        <div>
                          <div>
                            <IoWater className="weather-icon" />
                          </div>
                          <div className="measurement">
                            {
                              forecastArray[index].probabilityOfPrecipitation
                                .value
                            }
                            %
                          </div>
                        </div>
                      </div>
                      <div className="col center-text">
                        <div>
                          <div>
                            <RiMistFill className="weather-icon" />
                          </div>
                          <div className="measurement">
                            {forecastArray[index].relativeHumidity.value}%
                          </div>
                        </div>
                      </div>
                      <div className="col center-text">
                        <div>
                          <div>
                            <FiWind className="weather-icon" />
                          </div>
                          <div className="measurement">
                            {forecastArray[index].windSpeed}{" "}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Search;

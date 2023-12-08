import "./index.css";
import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
// import cities from "./city_db.json";
import * as client from "./client";
import { IoWater } from "react-icons/io5";
import { FaThermometerHalf } from "react-icons/fa";
import { FaWind } from "react-icons/fa";
import { FiWind } from "react-icons/fi";
import { WiHumidity } from "react-icons/wi";
import { RiMistFill } from "react-icons/ri";

function SearchResults() {
  const searchTerm = useParams().query;
  const MAX_RETRIES = 5;

  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [forecastArray, setForecastArray] = useState([]);
  const [showLoadAnim, setShowLoadAnim] = useState(true);
  const element = document.getElementById("searchbar");

  const searchForCities = async () => {
    setShowLoadAnim(true);
    setSearchResults([]);

    const response = await client.partialMatchCities(searchTerm);

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
    setSearchResults(response);
    setShowLoadAnim(false);
  };

  useEffect(() => {
    searchForCities();
  }, []);

  return (
    <div className="main-container mt-4">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
        <h2 className="mb-5">
          Results for: "{searchTerm}"{" "}
          <Link to="/search">
            <button className="btn btn-primary float-end">Search Again</button>
          </Link>
        </h2>
        {/* Loading animation taken from https://blog.hubspot.com/website/css-loading-animation */}
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
                  <div className="col-4 col-sm-4 col-md-5 col-lg-5 col-xl-5">
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
                      <div className="col-auto col-xl center-text">
                        <div>
                          <div>
                            <FaThermometerHalf className="weather-icon" />
                          </div>
                          <div className="measurement">
                            {forecastArray[index].temperature}&deg;F
                          </div>
                        </div>
                      </div>
                      <div className="col-auto col-xl center-text">
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
                      <div className="col-auto col-xl center-text">
                        <div>
                          <div>
                            <RiMistFill className="weather-icon" />
                          </div>
                          <div className="measurement">
                            {forecastArray[index].relativeHumidity.value}%
                          </div>
                        </div>
                      </div>
                      <div className="col-auto col-xl center-text">
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

export default SearchResults;

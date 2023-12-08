import * as searchClient from "../WeatherApp/search/client.js";
import { useState, useEffect } from "react";
import * as client from "./client.js";
import "./index.css";

function WeatherAdmin() {
  const [newCity, setNewCity] = useState({
    city: "",
    state: "",
    latitude: 0,
    longitude: 0,
    cityID: "",
  });
  const [cities, setCities] = useState([]);
  const getCities = async () => {
    const citiesResponse = await searchClient.getCities();
    setCities(citiesResponse[0].list);
  };
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getCities();
  }, []);

  const postCity = async () => {
    const cityName = newCity.city + ", " + newCity.state;
    setCities([cityName, ...cities]);
    const tempCity = {
      ...newCity,
      cityID: cityName,
    };
    client.addCity(tempCity);
    client.addCityToList(cityName);
  };

  const deleteCity = async (cityName) => {
    setCities(cities.filter((c) => c !== cityName));
    client.deleteCity(cityName);
    client.removeCityFromList(cityName);
  };

  useEffect(() => {
    const matches = cities.filter((city) =>
      city.toLowerCase().includes(searchText.text.toLowerCase())
    );
    setCities(matches);
  }, [searchText]);

  return (
    <div className="col-4" style={{ marginLeft: "35%" }}>
      <div>Weather Admin</div>
      <div>
        <h3>Add City</h3>
        <label className="mb-1" for="city">
          City
        </label>
        <input
          id="city"
          className="form-control mb-1"
          type="text"
          placeholder="City"
          onChange={(e) => setNewCity({ ...newCity, city: e.target.value })}
        ></input>
        <label className="mb-1" for="state">
          State
        </label>
        <input
          id="state"
          className="form-control mb-1"
          type="text"
          placeholder="State"
          onChange={(e) => setNewCity({ ...newCity, state: e.target.value })}
        ></input>
        <label className="mb-1" for="lat">
          Latitude
        </label>
        <input
          id="lat"
          className="form-control mb-1"
          type="text"
          placeholder="Latitude"
          onChange={(e) => setNewCity({ ...newCity, latitude: e.target.value })}
        ></input>
        <label className="mb-1" for="long">
          Longitude
        </label>
        <input
          id="long"
          className="form-control mb-1"
          type="text"
          placeholder="Longitude"
          onChange={(e) =>
            setNewCity({ ...newCity, longitude: e.target.value })
          }
        ></input>
        <button className="btn btn-primary mt-1 float-end" onClick={postCity}>
          Post
        </button>
      </div>
      <div style={{ marginTop: "75px" }}>
        <h3>Cities</h3>
        <label for="filter">Filter:</label>
        <input
          id="filter"
          className="form-control mt-2"
          placeholder="Filter"
          onChange={(e) =>
            setSearchText({ ...searchText, text: e.target.value })
          }
        ></input>
        <ul className="list-group mt-4">
          {cities &&
            cities.map((c, index) => (
              <li
                className="list-group-item mb-2"
                style={{ textDecoration: "none" }}
              >
                {c}
                <button
                  onClick={() => deleteCity(c)}
                  className="btn btn-danger float-end"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default WeatherAdmin;

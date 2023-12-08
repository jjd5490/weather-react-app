import axios from "axios";

const request = axios.create({
  withCredentials: true,
});

export const BASE_API = process.env.REACT_APP_BASE_API_URL;
export const USERS_API = `${BASE_API}/api`;
export const NOAA_API = "https://api.weather.gov";

export const addCity = async (city) => {
  const response = await request.post(`${USERS_API}/cities`, city);
  return response.data;
};

export const deleteCity = async (cityName) => {
  const response = await request.delete(`${USERS_API}/cities/${cityName}`);
  return response.data;
};

export const addCityToList = async (cityName) => {
  const response = await request.post(`${USERS_API}/citylist/${cityName}`);
  return response.data;
};

export const removeCityFromList = async (cityName) => {
  const response = await request.delete(`${USERS_API}/citylist/${cityName}`);
  return response.data;
};

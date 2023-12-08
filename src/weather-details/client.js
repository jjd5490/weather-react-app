import axios from "axios";

const request = axios.create({
  withCredentials: true,
});

export const BASE_API = process.env.REACT_APP_BASE_API_URL;
export const USERS_API = `${BASE_API}/api`;
export const NOAA_API = "https://api.weather.gov";

export const postComment = async (comment) => {
  const response = await request.post(`${USERS_API}/comments`, comment);
  return response.data;
};

export const findCity = async (id) => {
  const response = await request.get(`${USERS_API}/cities/${id}`);
  return response.data;
};

export const getCommentsByLocation = async (location) => {
  const response = await request.get(
    `${USERS_API}/comments/location/${location}`
  );
  return response.data;
};

export const getCurrentConditions = async (lat, long) => {
  let counter = 5;
  var response = null;
  while (counter > 0) {
    try {
      response = await fetch(`${NOAA_API}/points/${lat},${long}`);
      if (response.status < 400) {
        counter = 0;
      } else {
        response = null;
      }
    } catch {
      console.log("Can't fetch hourly url");
    }
    counter -= 1;
  }
  if (response === null) {
    return null;
  }

  const resJSON = await response.json();
  const properties = resJSON.properties;
  const hourlyURL = properties.forecastHourly;
  const dailyURL = properties.forecast;

  var hourlyResponse = null;
  counter = 5;
  while (counter > 0) {
    try {
      hourlyResponse = await fetch(hourlyURL);
      if (hourlyResponse.status < 400) {
        counter = 0;
      } else {
        hourlyResponse = null;
      }
    } catch {
      console.log("Can't fetch hourly url");
    }
    counter -= 1;
  }
  if (hourlyResponse === null) {
    return null;
  }
  console.log("hourly response");
  console.log(hourlyResponse);
  const hourlyJSON = await hourlyResponse.json();
  const hourlyForecast = hourlyJSON.properties.periods;

  var dailyResponse = null;
  counter = 5;
  while (counter > 0) {
    try {
      dailyResponse = await fetch(dailyURL);
      if (dailyResponse.status < 400) {
        counter = 0;
      } else {
        dailyResponse = null;
      }
    } catch {
      console.log("Can't fetch hourly url");
    }
    counter -= 1;
  }
  if (dailyResponse === null) {
    return null;
  }
  console.log("daily response");
  console.log(dailyResponse);
  const dailyJSON = await dailyResponse.json();
  const dailyForecast = dailyJSON.properties.periods;

  return {
    hourly: hourlyForecast,
    daily: dailyForecast,
  };

  // const response = await fetch(`${NOAA_API}/points/${lat},${long}`);
  // const resJSON = await response.json();
  // const properties = resJSON.properties;
  // const hourlyURL = properties.forecastHourly;
  // const hourlyResponse = await fetch(hourlyURL);
  // const hourlyJSON = await hourlyResponse.json();
  // const hourlyForecast = hourlyJSON.properties.periods;
  // return hourlyForecast[0];
};

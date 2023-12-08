import axios from "axios";

const request = axios.create({
  withCredentials: true,
});

export const BASE_API = process.env.REACT_APP_BASE_API_URL;
export const USERS_API = `${BASE_API}/api`;
export const NOAA_API = "https://api.weather.gov";

export const getCities = async () => {
  const response = await request.get(`${USERS_API}/citylist`);
  return response.data;
};

export const partialMatchCities = async (id) => {
  const response = await request.get(`${USERS_API}/cities/${id}`);
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
    return {
      shortForecast: "Status == 404",
      temperature: "",
      probabilityOfPrecipitation: "",
      relativeHumidity: {
        value: "",
      },
      windSpeed: "",
    };
  }

  const resJSON = await response.json();
  const properties = resJSON.properties;
  const hourlyURL = properties.forecastHourly;

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
    return {
      shortForecast: "Status == 500",
      temperature: "",
      probabilityOfPrecipitation: "",
      relativeHumidity: {
        value: "",
      },
      windSpeed: "",
    };
  }
  console.log("hourly response");
  console.log(hourlyResponse);
  const hourlyJSON = await hourlyResponse.json();
  const hourlyForecast = hourlyJSON.properties.periods;
  return hourlyForecast[0];

  // const response = await fetch(`${NOAA_API}/points/${lat},${long}`);
  // const resJSON = await response.json();
  // const properties = resJSON.properties;
  // const hourlyURL = properties.forecastHourly;
  // const hourlyResponse = await fetch(hourlyURL);
  // const hourlyJSON = await hourlyResponse.json();
  // const hourlyForecast = hourlyJSON.properties.periods;
  // return hourlyForecast[0];
};

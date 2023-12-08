import { React, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import * as likeClient from "../WeatherApp/likes/client";
import "./index.css";
import { FaLocationDot } from "react-icons/fa6";
import { IoWater } from "react-icons/io5";
import { FaThermometerHalf } from "react-icons/fa";
import { FiWind } from "react-icons/fi";
import { RiMistFill } from "react-icons/ri";
import { CiClock2 } from "react-icons/ci";
import { AiOutlineLineChart } from "react-icons/ai";
import { IoStarOutline } from "react-icons/io5";
import { IoStar } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import * as bookmarkClient from "../WeatherApp/bookmarks/client";
import * as userClient from "../users/client.js";

function WeatherDetail(props) {
  const [account, setAccount] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [newComment, setNewComment] = useState({
    city: "",
    author: "",
    text: "",
    time: "",
  });
  const [showLoadAnim, setShowLoadAnim] = useState(true);
  const [likes, setLikes] = useState([]);
  var location = useParams();
  if (props.location) {
    location = props;
  }

  const fetchAccount = async () => {
    const acnt = await userClient.account();
    setAccount(acnt);
    return acnt;
  };

  const getBookmarkStatus = async (acc) => {
    const exists = await bookmarkClient.checkBookmarkRelationship(
      acc.username,
      acc.city
    );
    setBookmarked(exists);
    return exists;
  };

  const getUserData = async () => {
    const acnt = await fetchAccount();
    const status = await getBookmarkStatus(acnt);
    console.log("Bookmark initial status: " + status);
  };
  useEffect(() => {
    getUserData();
  }, []);
  const navigate = useNavigate();

  const [forecasts, setForecasts] = useState(null);
  const [comments, setComments] = useState([]);

  const daily_container = document.getElementById("dailyContainer");
  const hourly_container = document.getElementById("hourlyContainer");
  const social_container = document.getElementById("socialContainer");
  const daily_button = document.getElementById("dailyButton");
  const hourly_button = document.getElementById("hourlyButton");
  const social_button = document.getElementById("socialButton");

  useEffect(() => {
    const getLocationForecast = async () => {
      const cityList = await client.findCity(location.location);
      const city = await cityList[0];
      console.log("Printing City");
      console.log(city);
      const lat = Math.round((parseFloat(city.latitude) * 100) / 100.0).toFixed(
        0
      );
      const long = Math.round(
        (parseFloat(city.longitude) * 100) / 100.0
      ).toFixed(0);

      const forecasts = await client.getCurrentConditions(lat, long);
      console.log(forecasts);
      setForecasts(forecasts);
      setShowLoadAnim(false);
    };
    getLocationForecast();
  }, []);

  function formatDateTime(date) {
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes} ${month}/${day}/${year}`;
  }

  const getLocationComments = async () => {
    console.log("Location at getLocationComments: " + location.location);
    let comments = await client.getCommentsByLocation(location.location);
    const processedComments = await comments.map((obj) => ({
      ...obj,
      ["time"]: formatDateTime(new Date(parseFloat(obj["time"]))),
    }));
    const tempLikes = [];
    for (let i = 0; i < processedComments.length; i++) {
      var c = processedComments[i];
      const cid = c._id.toString();
      const likes = await likeClient.getLikesOnComment(cid);
      tempLikes.push(likes);
      processedComments[i]["numLikes"] = likes.length;

      try {
        const userLikes = likes.filter((l) => {
          return l.user === account.username;
        });
        processedComments[i]["selfLiked"] = userLikes.length > 0;
      } catch {
        processedComments[i]["selfLiked"] = false;
      }
    }
    setComments(processedComments);
    setLikes(tempLikes);
    console.log("Likes:");
    console.log(likes);
    return comments;
  };

  useEffect(() => {
    getLocationComments();
  }, [location, account]);

  const formatDate = (datetime) => {
    const dateObj = new Date(datetime);
    return dateObj;
  };

  const toggleDailyVisibility = () => {
    daily_container.style.display = "block";
    daily_button.classList.add("active");
    hourly_container.style.display = "none";
    hourly_button.classList.remove("active");
    social_container.style.display = "none";
    social_button.classList.remove("active");
  };

  const toggleHourlyVisibility = () => {
    daily_container.style.display = "none";
    daily_button.classList.remove("active");
    hourly_container.style.display = "block";
    hourly_button.classList.add("active");
    social_container.style.display = "none";
    social_button.classList.remove("active");
  };

  const toggleSocialVisibility = () => {
    daily_container.style.display = "none";
    daily_button.classList.remove("active");
    hourly_container.style.display = "none";
    hourly_button.classList.remove("active");
    social_container.style.display = "block";
    social_button.classList.add("active");
  };

  const toggleBookmarked = () => {
    if (account) {
      setBookmarked(!bookmarked);
      if (bookmarked) {
        bookmarkClient.deleteBookmark(account.username, location.location);
      } else {
        bookmarkClient.createBookmark(account.username, location.location);
      }
    } else {
      navigate("/login");
    }
  };

  const toggleLike = async (index) => {
    if (account) {
      if (comments[index]["selfLiked"]) {
        const likeList = likes[index];

        const l = likeList.find((element) => element.user === account.username);
        if (l == null) {
          return;
        }
        const likeRes = await likeClient.deleteLike(l._id);
        const tempCom = await getLocationComments();
      } else {
        const likeRes = await likeClient.postLike(
          comments[index]._id.toString(),
          account.username
        );
        const tempCom = await getLocationComments();
      }
    } else {
      navigate("/login");
    }
  };

  const postComment = async () => {
    if (account) {
      const timestamp = Date.now().toString();
      const tempComment = {
        ...newComment,
        city: location.location,
        author: account.username,
        time: timestamp,
      };
      setNewComment({
        ...newComment,
        city: location.location,
        author: account.username,
        time: timestamp,
      });
      const res = await client.postComment(tempComment);
      getLocationComments();
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="">
      <h3 className="mt-4">
        <FaLocationDot className="mb-1 me-1" /> {location.location}
        <span className="bookmark-btn" onClick={toggleBookmarked}>
          {bookmarked ? (
            <IoStar className="float-end mb-1" />
          ) : (
            <IoStarOutline className="float-end mb-1" />
          )}
        </span>
      </h3>
      <nav className="nav nav-tabs mt-4">
        <div
          id="dailyButton"
          className="nav-link active forecast-tab"
          onClick={toggleDailyVisibility}
        >
          Daily Forecast
        </div>
        <div
          id="hourlyButton"
          className="nav-link forecast-tab"
          onClick={toggleHourlyVisibility}
        >
          Hourly Forecast
        </div>
        <div
          id="socialButton"
          className="nav-link forecast-tab"
          onClick={toggleSocialVisibility}
        >
          Social
        </div>
      </nav>
      <div id="dailyContainer" className="">
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
        {forecasts !== null ? (
          <div className="table-responsive ">
            <table className="table table-dark mt-4 pt-2 table-header">
              <thead className="sticky-top">
                <tr>
                  <th scope="col">
                    Time <CiClock2 className="mb-1" />
                  </th>
                  <th scope="col">
                    Forecast <AiOutlineLineChart className="mb-1" />
                  </th>
                  <th scope="col">
                    Temp <FaThermometerHalf className="mb-1" />
                  </th>
                  <th scope="col">
                    Prec <IoWater className="mb-1" />
                  </th>
                  <th scope="col">
                    Humidity <RiMistFill className="mb-1" />
                  </th>
                  <th scope="col">
                    Wind <FiWind className="mb-1" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {forecasts.daily.map((d, index) => (
                  <tr>
                    <th scope="row">{d.name}</th>
                    <td>{d.shortForecast}</td>
                    <td>{d.temperature}&deg;</td>
                    <td>
                      {d.probabilityOfPrecipitation.value === null
                        ? 0
                        : d.probabilityOfPrecipitation.value}
                      %
                    </td>
                    <td>{d.relativeHumidity.value}%</td>
                    <td>{d.windSpeed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="mt-4">
            National Oceanic and Atmospheric Administration Server Error
          </h3>
        )}
      </div>
      <div id="hourlyContainer" style={{ display: "none" }}>
        {forecasts !== null ? (
          <>
            <table className="table table-dark mt-4 table-responsive pt-2">
              <thead className="sticky-top pt-2 pb-2 mt-2">
                <tr>
                  <th scope="col">
                    Time <CiClock2 className="mb-1" />
                  </th>
                  <th scope="col">
                    Forecast <AiOutlineLineChart className="mb-1" />
                  </th>
                  <th scope="col">
                    Temp <FaThermometerHalf className="mb-1" />
                  </th>
                  <th scope="col">
                    Prec <IoWater className="mb-1" />
                  </th>
                  <th scope="col">
                    Humidity <RiMistFill className="mb-1" />
                  </th>
                  <th scope="col">
                    Wind <FiWind className="mb-1" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {forecasts.hourly.map((d, index) => (
                  <tr>
                    <th scope="row">
                      {d.startTime.substring(5, 10)}{" "}
                      {d.startTime.substring(11, 16)}
                    </th>
                    <td>{d.shortForecast}</td>
                    <td>{d.temperature}&deg;</td>
                    <td>
                      {d.probabilityOfPrecipitation.value === null
                        ? 0
                        : d.probabilityOfPrecipitation.value}
                      %
                    </td>
                    <td>{d.relativeHumidity.value}%</td>
                    <td>{d.windSpeed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <h3 className="mt-4">
            National Oceanic and Atmospheric Administration Server Error
          </h3>
        )}
      </div>
      <div
        id="socialContainer"
        className="mt-4 col col-sm-9 col-md-8 col-lg-10 col-xl-6"
        style={{ display: "none" }}
      >
        <div className="">
          <div>
            <textarea
              className="form-control"
              placeholder="New comment..."
              onChange={(e) => {
                setNewComment({ ...newComment, text: e.target.value });
              }}
            ></textarea>
          </div>
          <div className="" style={{ textAlign: "right" }}>
            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={postComment}
            >
              Post
            </button>
          </div>
        </div>
        <h3 className="mb-3">Comments</h3>
        <ul className="list-group">
          {comments.map((c, index) => (
            <li className="my-li mb-2">
              <div className="comment ps-2 pe-2 pb-2 pt-2">
                <Link to={`/profile/${c.author}`}>
                  <div className="comment-username">{c.author} :</div>
                </Link>
                <div className="comment-text ms-1 me-1 mt-2 ps-2 pt-1">
                  {c.text}
                </div>
                <div className="flex-container">
                  <div className="time pb-1">{c.time}</div>
                  <div className="flex-grow">
                    <div className="float-end"></div>
                    <div
                      className="float-end like-btn"
                      onClick={() => toggleLike(index)}
                    >
                      {console.log(c.selfLiked)}
                      {c.selfLiked ? (
                        <>
                          <FaHeart className="pb-1 me-1 heart" />
                          {c.numLikes}
                        </>
                      ) : (
                        <>
                          <FaRegHeart className="pb-1 me-1" />
                          {c.numLikes}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default WeatherDetail;

import * as client from "./client";
import { HashRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../account-state/accountReducer";
import { IoIosLink } from "react-icons/io";
import { Routes, Route, Navigate } from "react-router";
import CommentList from "./commentList";
import BookmarkList from "./bookmarkList";
import Bookmarks from "../WeatherApp/bookmarks";
import "./account.css";

function Account(props) {
  console.log(props);
  const profileType = props.account;
  const dispatch = useDispatch();
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  const findUserById = async (id) => {
    const user = await client.findUserById(id);
    setAccount(user);
    console.log("Account:");
    console.log(account);
  };

  const signout = async () => {
    await client.signout();
    dispatch(setProfile(null));
    navigate("/login");
  };

  const navigate = useNavigate();
  const fetchAccount = async () => {
    const account = await client.account();
    setAccount(account);
  };

  const fetchComments = async () => {
    if (account != null) {
      const newComments = await client.getCommentsByUser(account.username);
      setComments(newComments);
    }
  };

  const fetchLikes = async () => {
    if (account != null) {
      const newLikes = await client.getLikesByUser(account.username);
      setLikes(newLikes);
    }
  };

  useEffect(() => {
    if (id) {
      findUserById(id);
    } else {
      fetchAccount();
    }
  }, []);

  useEffect(() => {
    fetchComments();
    fetchLikes();
  }, [account]);

  const save = async () => {
    await client.updateUser(account);
  };

  function formatDateTime(date) {
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes} ${month}/${day}/${year}`;
  }

  return (
    <div className="account-container">
      <div className="col col-sm-10 col-md-8 col-lg-7 col-xl-6 ms-2 ms-lg-4">
        {profileType === "self"
          ? account && (
              <>
                <h1 className="mt-3 mb-4">{account.username}</h1>
                <div>
                  <div className="row mb-1">
                    <div className="col">
                      <label for="firstname">First Name</label>
                    </div>
                    <div className="col">
                      <label for="lastname">Last Name</label>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <input
                        id="firstname"
                        className="form-control"
                        placeholder="First Name"
                        value={account.firstName}
                        onChange={(e) =>
                          setAccount({ ...account, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div className="col">
                      <input
                        id="lastname"
                        className="form-control"
                        placeholder="Last Name"
                        value={account.lastName}
                        onChange={(e) =>
                          setAccount({ ...account, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-1">
                    <div className="col">
                      <label for="dob">Date of Birth</label>
                    </div>
                    <div className="col">
                      <label for="email">Email</label>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <input
                        id="dob"
                        type="date"
                        placeholder="2000-01-01"
                        className="form-control"
                        value={account.dob}
                        onChange={(e) =>
                          setAccount({ ...account, dob: e.target.value })
                        }
                      />
                    </div>
                    <div className="col">
                      <input
                        id="email"
                        placeholder="johndoe@gmail.com"
                        className="form-control"
                        value={account.email}
                        onChange={(e) =>
                          setAccount({ ...account, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-1">
                    <div className="col">
                      <label for="password">Password</label>
                    </div>
                    <div className="col">
                      <label for="role">Role</label>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col">
                      <input
                        id="password"
                        className="form-control"
                        type="password"
                        value={account.password}
                        onChange={(e) =>
                          setAccount({ ...account, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="col">
                      <select
                        id="role"
                        className="form-control"
                        onChange={(e) =>
                          setAccount({ ...account, role: e.target.value })
                        }
                      >
                        <option value="USER">User</option>
                        <option value="METEOROLOGIST">Meteorologist</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-1">
                    <div className="col">
                      <label for="hometown">Hometown</label>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col">
                      <input
                        id="hometown"
                        className="form-control"
                        placeholder="Boston, Massachusetts"
                        type="text"
                        value={account.city}
                        onChange={(e) =>
                          setAccount({ ...account, city: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <button className="btn signup-btn me-3" onClick={save}>
                    Save
                  </button>
                  <button className="btn btn-danger" onClick={signout}>
                    Signout
                  </button>
                  {/* <Link to="/project/admin/users" className="btn btn-warning w-100">
            Users
          </Link> */}
                </div>
              </>
            )
          : account && (
              <>
                <h1 className="mt-3 mb-4">{account.username}</h1>
                <div className="card col pt-2 pb-2">
                  <div className="row">
                    <div className="col-auto">
                      <div className="row mb1 ps-4 user-label">First Name:</div>
                      <div className="row mb1 ps-4 user-label">Last Name:</div>
                      <div className="row mb1 ps-4 user-label">Hometown:</div>
                      <div className="row mb1 ps-4 user-label">Role:</div>
                    </div>
                    <div className="col">
                      <div className="row mb1 ps-4">{account.firstName}</div>
                      <div className="row mb1 ps-4 ">{account.lastName}</div>
                      <div className="row mb1 ps-4">
                        {" "}
                        <Link
                          style={{ textDecoration: "none", padding: "0" }}
                          to={`/details/${account.city}`}
                        >
                          {account.city} <IoIosLink />
                        </Link>
                      </div>
                      <div className="row mb1 ps-4">{account.role}</div>
                    </div>
                  </div>
                </div>
                {/* <div className="card col pt-2 pb-2">
                  <div className="row mb-1 ps-4">
                    <div className="col-auto user-label">First Name:</div>
                    <div className="col">{account.firstName}</div>
                  </div>
                  <div className="row mb-1 ps-4">
                    <div className="col-auto user-label">Last Name:</div>
                    <div className="col">{account.lastName}</div>
                  </div>
                  <div className="row mb-1 ps-4">
                    <div className="col-auto user-label">Hometown:</div>
                    <div className="col">
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/details/${account.city}`}
                      >
                        {account.city} <IoIosLink />
                      </Link>
                    </div>
                  </div>
                  <div className="row mb-1 ps-4">
                    <div className="col-auto user-label">Role:</div>
                    <div className="col">{account.role}</div>
                  </div>
                </div> */}
              </>
            )}
        {account && <Bookmarks account={account} />}
        <h4 className="mt-4">Comments</h4>
        <ul className="list-group">
          {comments &&
            comments.map((c, index) => (
              <li className="my-li mb-2">
                <div className="comment ps-2 pe-2 pb-2 pt-2">
                  <Link to={`/profile/${c.author}`}>
                    <div className="comment-username">{c.author} :</div>
                  </Link>
                  <div className="comment-text ms-1 me-1 mt-2 ps-2 pt-1">
                    {c.text}
                  </div>
                  <div className="flex-container">
                    <div className="time pb-1">
                      {formatDateTime(new Date(parseFloat(c.time)))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        <h4 className="mt-4">Liked Comments</h4>
        <ul className="list-group">
          {likes &&
            likes.map((c, index) => (
              <li className="my-li mb-2">
                <div className="comment ps-2 pe-2 pb-2 pt-2">
                  <Link to={`/profile/${c.author}`}>
                    <div className="comment-username">{c.author} :</div>
                  </Link>
                  <div className="comment-text ms-1 me-1 mt-2 ps-2 pt-1">
                    {c.text}
                  </div>
                  <div className="flex-container">
                    <div className="time pb-1">
                      {formatDateTime(new Date(parseFloat(c.time)))}
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
export default Account;

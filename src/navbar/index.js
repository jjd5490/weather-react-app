import { React } from "react";
import { Link, useLocation } from "react-router-dom";
import "./index.css";
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as userClient from "../users/client.js";
import { setProfile } from "../account-state/accountReducer";

function Navbar() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const account2 = useSelector((state) => state.accountReducer.account);
  const [account, setAccount] = useState(null);
  const fetchAccount = async () => {
    const account = await userClient.account();
    setAccount(account);
    dispatch(setProfile(account));
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <nav className="ms-2 me-2 navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
      <a className="navbar-brand" href="/">
        WeatherCenter
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav" style={{ width: "100%" }}>
          <li
            className={`nav-item ${
              pathname.includes("home") ? "nav-active-item" : ""
            }`}
          >
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li
            className={`nav-item ${
              pathname.includes("search") ? "nav-active-item" : ""
            }`}
          >
            <Link className="nav-link" to="/search">
              Search
            </Link>
          </li>
          {account2 ? null : (
            <li
              className={`nav-item ${
                pathname.includes("login") ? "nav-active-item" : ""
              }`}
            >
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          )}
          {account2 ? null : (
            <li
              className={`nav-item ${
                pathname.includes("register") ? "nav-active-item" : ""
              }`}
            >
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
          )}
          {account2 ? (
            <li
              className={`nav-item ${
                pathname.includes("profile") ? "nav-active-item" : ""
              }`}
            >
              <Link className="nav-link" to="/profile">
                <CgProfile /> {account2.username}
              </Link>
            </li>
          ) : null}
          {account2 && account2.role === "METEOROLOGIST" ? (
            <li
              className={`nav-item ${
                pathname.includes("weather-admin") ? "nav-active-item" : ""
              }`}
            >
              <Link className="nav-link" to="/weather-admin">
                Weather Admin
              </Link>
            </li>
          ) : null}
          {account2 && account2.role === "ADMIN" ? (
            <li
              className={`nav-item ${
                pathname.includes("user-admin") ? "nav-active-item" : ""
              }`}
            >
              <Link className="nav-link" to="/user-admin">
                User Admin
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

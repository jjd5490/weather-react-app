import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as client from "./client";

function Signup() {
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    city: "",
  });
  const navigate = useNavigate();
  const signup = async () => {
    try {
      await client.signup(credentials);
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  return (
    <div className="center-horizontally mt-5 col-md-6 col-lg-5 col-xl-3 card signup-card">
      <h3 className="mt-3">Signup</h3>
      {error && <div>{error}</div>}
      <div className="row">
        <label className="" for="username">
          Username:{" "}
        </label>
      </div>
      <div className="row center-children ms-4 me-4 mt-2">
        <div>
          <input
            id="username"
            className="form-control"
            placeholder="evenstar"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />
        </div>
      </div>
      <div className="row mt-2">
        <label className="" for="password">
          Password:{" "}
        </label>
      </div>
      <div className="row ms-4 me-4 mt-2">
        <div className="">
          <input
            id="password"
            className="form-control"
            type="password"
            placeholder="password123"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
        </div>
      </div>
      <div className="row mt-2">
        <label className="" for="hometown">
          Hometown:
        </label>
      </div>
      <div className="row ms-4 me-4 mt-2">
        <div className="">
          <input
            id="hometown"
            className="form-control"
            type="text"
            placeholder="Boston, Massachusetts"
            value={credentials.city}
            onChange={(e) =>
              setCredentials({ ...credentials, city: e.target.value })
            }
          />
        </div>
      </div>
      <div className="row mt-2">
        <label className="" for="role">
          Role:
        </label>
      </div>
      <div className="row ms-4 me-4 mt-2 mb-4">
        <select
          id="role"
          className="form-control"
          onChange={(e) =>
            setCredentials({ ...credentials, role: e.target.value })
          }
        >
          <option value="USER">User</option>
          <option value="METEOROLOGIST">Meteorologist</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      {/* <div className="row">
        <div className="col-6">
          {" "}
          <label className="" for="username">
            Username:{" "}
          </label>
        </div>
        <div className="col-6">
          <label className="" for="password">
            Password:{" "}
          </label>
        </div>
      </div>
      <div className="row mt-2 mb-4">
        <div className="col-6 center-children">
          <input
            id="username"
            className="form-control w-75"
            placeholder="evenstar"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                username: e.target.value,
              })
            }
          />
        </div>
        <div className="col-6">
          <input
            id="password"
            className="form-control w-75"
            type="password"
            placeholder="password123"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                password: e.target.value,
              })
            }
          />
        </div>
      </div> */}
      <div className="mb-3">
        <button className="btn signup-btn" onClick={signup}>
          Signup
        </button>
      </div>
    </div>
  );
}
export default Signup;

import * as client from "./client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../account-state/accountReducer";

function Signin() {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const signin = async () => {
    try {
      const response = await client.signin(credentials);
      dispatch(setProfile(response));
      navigate("/profile");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="center-horizontally mt-5 col-md-6 col-lg-5 col-xl-3 card signup-card">
      <h3 className="mt-3">Login</h3>
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
      <div className="row ms-4 me-4 mt-2 mb-4">
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
              setCredentials({ ...credentials, username: e.target.value })
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
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
        </div>
      </div> */}
      <div className="mb-3">
        <button className="btn signup-btn" onClick={signin}>
          Login
        </button>
      </div>
    </div>
  );
}
export default Signin;

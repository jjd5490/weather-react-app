import SolarChart from "./solar-chart";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { setProfile } from "../account-state/accountReducer";
import { Link } from "react-router-dom";
import WeatherDetail from "../weather-details";
import Bookmarks from "./bookmarks";
import PopularLocations from "./popular-locations";
import * as userClient from "../users/client.js";

function WeatherApp() {
  // const account = useSelector((state) => state.accountReducer.account);
  const [account, setAccount] = useState(null);
  const fetchAccount = async () => {
    const account = await userClient.account();
    setAccount(account);
  };
  useEffect(() => {
    fetchAccount();
  }, []);

  console.log(account);
  return (
    <div className="flex-container">
      <div className="flex-grow me-lg-4 ms-lg-4">
        <WeatherDetail
          location={account ? account.city : "Boston, Massachusetts"}
        />
        <div
          className="d-sm-block d-lg-none right-sidebar ps-4 pt-3"
          style={{ border: "none" }}
        >
          {/* <div className="center-text siderbar-label mb-2">Solar Elevation</div> */}
          {/* <SolarChart /> */}
          {account === "" || account == null ? (
            <PopularLocations />
          ) : (
            <Bookmarks account={account} />
          )}
        </div>
      </div>
      <div className="d-none d-lg-block right-sidebar ps-4 pt-3">
        <div className="center-text siderbar-label mb-2">Solar Elevation</div>
        <SolarChart />
        {account === "" || account == null ? (
          <PopularLocations />
        ) : (
          <Bookmarks account={account} />
        )}
      </div>
    </div>
  );
}
export default WeatherApp;

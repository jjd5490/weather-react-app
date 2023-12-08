import logo from "./logo.svg";
import "./App.css";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import WeatherApp from "./WeatherApp";
import Navbar from "./navbar";
import Signin from "./users/signin";
import Signup from "./users/signup";
import Search from "./WeatherApp/search";
import SearchForm from "./WeatherApp/search/searchForm.js";
import SearchResults from "./WeatherApp/search/searchResults.js";
import Account from "./users/account";
import WeatherDetail from "./weather-details";
import WeatherAdmin from "./weather-admin";
import UserTable from "./users/table.js";
import store from "./store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <div className="ms-sm-1 ms-lg-4 me-1 me-lg-4">
        <HashRouter>
          <Navbar />
          <div>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<WeatherApp />} />
              {/* <Route path="/search" element={<Search />} /> */}
              <Route path="/search" element={<SearchForm />} />
              <Route path="/search/:query" element={<SearchResults />} />
              <Route path="/login" element={<Signin />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/profile" element={<Account account={"self"} />} />
              <Route
                path="/profile/:id"
                element={<Account account={"other"} />}
              />
              <Route path="/details/:location" element={<WeatherDetail />} />
              <Route path="/weather-admin" element={<WeatherAdmin />} />
              <Route path="/user-admin" element={<UserTable />} />
            </Routes>
          </div>
        </HashRouter>
      </div>
    </Provider>
  );
}

export default App;

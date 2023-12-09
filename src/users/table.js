import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as client from "./client";
import "./index.css";
import {
  BsFillCheckCircleFill,
  BsPencil,
  BsPlusCircleFill,
  BsTrash3Fill,
} from "react-icons/bs";

function UserTable() {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "USER",
  });
  const createUser = async () => {
    try {
      const newUser = await client.createUser(user);
      setUsers([newUser, ...users]);
    } catch (err) {
      console.log(err);
    }
  };

  const selectUser = async (user) => {
    try {
      const u = await client.findUserById(user.username);
      setUser(u);
    } catch (err) {
      console.log(err);
    }
  };
  const updateUser = async () => {
    try {
      const status = await client.updateUser(user);
      setUsers(users.map((u) => (u._id === user._id ? user : u)));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (user) => {
    try {
      await client.deleteUser(user);
      setUsers(users.filter((u) => u._id !== user._id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>User List</h1>
      <table className="table table-dark">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
          <tr>
            <td>
              <input
                style={{ color: "white" }}
                className="form-control w-75 white-text"
                placeholder="Username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </td>
            <td>
              <input
                className="form-control w-75 white-text"
                placeholder="Password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </td>
            <td>
              <input
                className="form-control w-75 white-text"
                value={user.firstName}
                placeholder="Tony"
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
              />
            </td>
            <td>
              <input
                placeholder="Stark"
                className="form-control w-75 white-text"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </td>
            <td>
              <select
                className="form-control w-75 white-text"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="METEOROLOGIST">Meteorologist</option>
              </select>
            </td>
            <td>
              <button className="btn btn-success me-2" onClick={updateUser}>
                <BsFillCheckCircleFill
                  className=""
                  style={{ fontSize: "1.2rem" }}
                />
              </button>
              <button className="btn btn-success" onClick={createUser}>
                <BsPlusCircleFill className="" style={{ fontSize: "1.2rem" }} />
              </button>
            </td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <Link to={`/project/account/${user._id}`}>{user.username}</Link>
              </td>
              <td>{user.password}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.role}</td>
              <td className="text-nowrap">
                <button
                  className="btn btn-danger me-2"
                  onClick={() => deleteUser(user)}
                >
                  <BsTrash3Fill />
                </button>
                <button className="btn btn-warning me-2">
                  <BsPencil onClick={() => selectUser(user)} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default UserTable;

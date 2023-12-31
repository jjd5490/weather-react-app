import axios from "axios";

const request = axios.create({
  withCredentials: true,
});

export const BASE_API = process.env.REACT_APP_BASE_API_URL;
console.log("Base API:");
console.log(BASE_API);
export const USERS_API = `${BASE_API}/api/users`;
export const signin = async (credentials) => {
  const response = await request.post(`${USERS_API}/signin`, credentials);
  return response.data;
};

export const account = async () => {
  const response = await request.post(`${USERS_API}/account`);
  return response.data;
};

export const updateUser = async (user) => {
  const response = await request.put(`${USERS_API}/${user._id}`, user);
  return response.data;
};

export const findAllUsers = async () => {
  const response = await request.get(`${USERS_API}`);
  return response.data;
};

export const createUser = async (user) => {
  const response = await request.post(`${USERS_API}`, user);
  return response.data;
};

export const findUserById = async (id) => {
  const response = await request.get(`${USERS_API}/${id}`);
  return response.data;
};

export const deleteUser = async (user) => {
  const response = await request.delete(`${USERS_API}/${user._id}`);
  return response.data;
};

export const signup = async (credentials) => {
  const response = await request.post(`${USERS_API}/signup`, credentials);
  return response.data;
};

export const signout = async () => {
  const response = await request.post(`${USERS_API}/signout`);
  return response.data;
};

export const getCommentsByUser = async (userID) => {
  const response = await request.get(
    `${BASE_API}/api/comments/author/${userID}`
  );
  return response.data;
};

export const getLikesByUser = async (userID) => {
  const response = await request.get(`${BASE_API}/api/likes/user/${userID}`);
  const comments = [];
  for (let i = 0; i < response.data.length; i++) {
    const cID = response.data[i].comment_id;
    const commentRes = await request.get(`${BASE_API}/api/comments/${cID}`);
    comments.push(commentRes.data);
  }
  return comments;
};

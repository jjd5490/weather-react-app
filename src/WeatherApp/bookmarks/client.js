import axios from "axios";

const request = axios.create({
  withCredentials: true,
});

export const BASE_API = process.env.REACT_APP_BASE_API_URL;
export const USERS_API = `${BASE_API}/api`;

export const getBookmarksByUser = async (username) => {
  const bookmarks = await request.get(`${USERS_API}/bookmarks/${username}`);
  return bookmarks.data;
};

export const checkBookmarkRelationship = async (username, location) => {
  const response = await request.get(
    `${USERS_API}/bookmarks/${username}/${location}`
  );
  return response.data;
};

export const createBookmark = async (username, location) => {
  if (username == null) {
    return;
  }
  const response = await request.post(
    `${USERS_API}/bookmarks/create/${username}/${location}`
  );
  return response.data;
};

export const deleteBookmark = async (username, location) => {
  if (username == null) {
    return;
  }
  const response = await request.delete(
    `${USERS_API}/bookmarks/delete/${username}/${location}`
  );
  return response.data;
};

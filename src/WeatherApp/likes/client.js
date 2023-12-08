import axios from "axios";

const request = axios.create({
  withCredentials: true,
});

export const BASE_API = process.env.REACT_APP_BASE_API_URL;
export const USERS_API = `${BASE_API}/api`;

export const getLikesOnComment = async (commentID) => {
  const likes = await request.get(`${USERS_API}/likes/${commentID}`);
  return likes.data;
};

export const postLike = async (commentID, userID) => {
  const likes = await request.post(`${USERS_API}/likes/${commentID}/${userID}`);
  return likes.data;
};

export const deleteLike = async (postID) => {
  const likes = await request.delete(`${USERS_API}/like/delete/${postID}`);
  return likes.data;
};

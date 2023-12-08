import { React, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./index.css";
import * as client from "./client";
import { IoCloseCircle } from "react-icons/io5";
import { FaRegWindowClose } from "react-icons/fa";

function Bookmarks(props) {
  const [bookmarks, setBookmarks] = useState([]);
  const account = props.account;
  const username = account.username;

  const fetchBookmarks = async () => {
    const bookmarkrequest = await client.getBookmarksByUser(username);
    console.log(bookmarkrequest);
    setBookmarks(bookmarkrequest);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const deleteBookmark = async (index) => {
    const location = bookmarks[index].city;
    const req = await client.deleteBookmark(username, location);
    setBookmarks(
      bookmarks.filter((b, i) => {
        return i !== index;
      })
    );
  };

  return (
    <>
      <div className="center-text siderbar-label mt-4 mb-2">Bookmarks</div>
      <ul className="list-group bookmark-list">
        {bookmarks.map((b, index) => (
          <li className="list-group-item bookmark-item mb-2 pt-3 pb-3">
            <Link to={`/details/${b.city}`}>{b.city}</Link>
            <FaRegWindowClose
              className="delete-bookmark-btn float-end"
              onClick={() => {
                deleteBookmark(index);
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
export default Bookmarks;

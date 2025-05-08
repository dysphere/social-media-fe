import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";

const Post = ({id, content, author, like}) => {
    return (<div>

    </div>)
}

const Posts = () => {

    useEffect(() => {
        fetch("https://social-media-be-oqoe.onrender.com/", { mode: "cors" })
          .then((response) => response.json())
          .then((response) => console.log(response))
          .catch((error) => console.error(error));
      }, []);

    return (<div></div>)
}

const PostsPage = () => {
    return (<div>
        <Header></Header>
    </div>)
}

export default PostsPage;
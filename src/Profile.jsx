import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./Header";
import { Button } from "@mantine/core";

const Post = ({id, content, createdAt}) => {

    const postLink = `/post/${id}`

    return (<div>
        <Link to={postLink}>{content}</Link>
        <p>{createdAt}</p>
    </div>)
}

const Profile = () => {

    const { id } = useParams();
    const [profile, setProfile] = useState({});
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(false);
    const [load, setLoading] = useState(true);

     useEffect(() => {
            fetch(`http://localhost:3000/profile/${id}`,
                 { mode: "cors" ,
                    credentials: 'include',
                 })
              .then((response) => response.json())
              .then((response) => {console.log(response.profile.user.posts); setProfile(response.profile); setUser(response.profile.user); setPosts(response.profile.user.posts);})
              .catch((error) => setError(error))
              .finally(() => setLoading(false));
          }, [id]);

          const postscards = 
          !error && !load && posts ? posts.map((post) => (
            <div key={post.id}>
                <Post
                id={post.id}
                content={post.content}
                createdAt={post.createdAt}
                />
            </div>
          )) : null;

    return (<div>
        <img
  src={profile.avatar} />
  <p>{user.username}</p>
  <p>{profile.bio}</p>
  <div>{postscards}</div>
    </div>)
}

const ProfilePage = () => {
    return (<div>
        <Header></Header>
        <Profile></Profile>
    </div>)
}

export default ProfilePage;
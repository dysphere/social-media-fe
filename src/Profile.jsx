import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./Header";
import { Textarea, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

const Post = ({id, content, createdAt, comment, like}) => {

    const postLink = `/post/${id}`

    return (<div>
        <p>{content}</p>
        <p>{createdAt}</p>
        <Link to={postLink}>{comment} comment(s)</Link>
        <p>{like} like(s)</p>
    </div>)
}

const Profile = () => {

    const { id } = useParams();
    const {user, isAuth} = useContext(AuthContext);

    const [profile, setProfile] = useState({});
    const [person, setPerson] = useState({});
    const [follows, setFollows] = useState([]);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(false);
    const [load, setLoading] = useState(true);

     useEffect(() => {
            fetch(`http://localhost:3000/profile/${id}`,
                 { mode: "cors" ,
                    credentials: 'include',
                 })
              .then((response) => response.json())
              .then((response) => {console.log(response.profile); setProfile(response.profile); setPerson(response.profile.user); setFollows(response.profile.user.followedBy); setPosts(response.profile.user.posts);})
              .catch((error) => setError(error))
              .finally(() => setLoading(false));
          }, [id]);

          const toggleFollow = async (id) => {
            try {
                const follow = await fetch(`http://localhost:3000/user/${id}/follow`,
                    {
                    mode: "cors" ,
                    credentials: 'include',
                    method: "POST",
                    }
                );
                console.log(follow);
    
            }
            catch(err) {
                console.error('Error toggling follow', err);
            }
        }

          const postscards = 
          !error && !load && posts ? posts.map((post) => (
            <div key={post.id}>
                <Post
                id={post.id}
                content={post.content}
                createdAt={post.createdAt}
                comment={post.comment.length}
                like={post.like.length}
                />
            </div>
          )) : null;

    return (<div>
        <img
  src={profile.avatar} />
  <p>{user.username}</p>
  <Button onClick={() => toggleFollow(user.id)}>Follow</Button>
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
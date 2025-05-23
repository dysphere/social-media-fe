import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./Header";
import { Textarea, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import heartBlack from "../src/assets/heart-black.svg"
import heartOutline from '../src/assets/heart-outline.svg';

const Post = ({id, content, author, createdAt, comment, likeCount, handleLike, liked}) => {
    const postLink = `/post/${id}`

    return (<div className="flex flex-col w-96 border-2 p-6 rounded-xl border-indigo-500">
        <p>{content}</p>
        <p>Posted: {createdAt}</p>
        <p>By: {author}</p>
        <div className="flex flex-row gap-4">
        <div className="flex flex-row gap-1">
        {liked ? <button onClick={handleLike} className="size-4">
  <img src={heartBlack} alt="Button Image"/>
    </button> : 
        <button onClick={handleLike} className="size-4">
  <img src={heartOutline} alt="Button Image"/>
    </button>}
    <p>{likeCount} like(s)</p>
    </div>
    <Link to={postLink}>{comment} comment(s)</Link>
    </div>
    </div>)
}
const Profile = () => {

    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [profile, setProfile] = useState({});
    const [person, setPerson] = useState({});
    const [bio, setBio] = useState("");
    const [following, setFollowing] = useState();
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState([]);
    const [error, setError] = useState(false);
    const [load, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);

     useEffect(() => {
            fetch(`http://localhost:3000/profile/${id}`,
                 { mode: "cors" ,
                    credentials: 'include',
                 })
              .then((response) => response.json())
              .then((response) => {
                console.log(response.profile);
                setProfile(response.profile); 
                setBio(response.profile.bio); 
                setPerson(response.profile.user); 
                setFollowing(response.isFollowing); 
                setPosts(response.profile.user.posts); 
                setLikes(response.profile.user.posts.reduce((acc, post) => {
                acc[post.id] = post.like;
                return acc;
                }, {}));
                setLiked(response.profile.user.posts.reduce((acc, post) => {
                    acc[post.id] = post.like.some((like) => like.username === user.username);
                    return acc;
                    }, {}));
                form.setFieldValue('bio', response.profile.bio);})
              .catch((error) => setError(error))
              .finally(() => setLoading(false));
          }, [id]);

    const toggleFollow = async (id) => {
    try {
        await fetch(`http://localhost:3000/user/${id}/follow`,
            {
            mode: "cors" ,
            credentials: 'include',
            method: "POST",
            }
        );
        if (following) {
            setFollowing(false);
        }
        else {
            setFollowing(true);
        }

    }
    catch(err) {
        console.error('Error toggling follow', err);
    }
}

const ToggleLike = async (id) => {
        try {
            await fetch(`http://localhost:3000/post/${id}/like`, {
            mode: "cors",
            credentials: 'include',
            method: "PUT",
                }); 
          const isLiked = liked[id];
          if (isLiked) {
            setLiked({...liked, [id]: false});
            setLikes({...likes, [id]: likes[id].filter((like) => like.username != user.username)});
          }
          else {
            setLiked({...liked, [id]: true});
            setLikes({...likes, [id]: [...likes[id], user]});
          }

        }
        catch(err) {
            console.error('Error toggling like', err);
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
       likeCount={likes[post.id].length} 
        handleLike={() => ToggleLike(post.id)} 
        liked={liked[post.id]} 
        />
    </div>
    )) : null;

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          bio: '',
        },
      });

    const handleEdit = () => {
        setEdit(true);
    }

    const cancelEdit = () => {
        setEdit(false);
    }

    const submitEdit = async (id) => {
        try {
            const formData = form.getValues();
            const profile = await fetch(`http://localhost:3000/profile/${id}/update`,
                {
                mode: "cors" ,
                credentials: 'include',
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify(formData),
                }
            );
            const data = await profile.json();
            setBio(data.profile.bio);
            setEdit(false);

        }
        catch(err) {
            console.error('Error editing profile', err);
        }
    }

    return (<div className="flex flex-col items-center">
        <img
  src={profile.avatar} />
  <div className="flex flex-col">
  <p>{person.username}</p>
  {following? <Button onClick={() => toggleFollow(person.id)}>Unfollow</Button> : 
  <Button onClick={() => toggleFollow(person.id)}>Follow</Button>}
  </div>
 {user.username === person.username && edit ? 
 <form onSubmit={(e) => {e.preventDefault(); submitEdit(profile.id);}}>
    <Textarea
    {...form.getInputProps('bio')}
    key={form.key('bio')}/>
    <Button onClick={cancelEdit}>Cancel</Button>
    <Button type="submit">Submit</Button>
 </form> : 
 user.username === person.username && !edit ?
 <div><p>{bio}</p>
 <Button onClick={handleEdit}>Edit</Button></div> : <p>{bio}</p>}
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
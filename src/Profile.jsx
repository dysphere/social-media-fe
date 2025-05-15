import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./Header";
import { Textarea, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import heartBlack from "../src/assets/heart-black.svg"
import heartOutline from '../src/assets/heart-outline.svg';

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
    const { user } = useContext(AuthContext);

    const [profile, setProfile] = useState({});
    const [person, setPerson] = useState({});
    const [bio, setBio] = useState("");
    const [follows, setFollows] = useState([]);
    const [posts, setPosts] = useState([]);
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
                console.log(response.profile.user.followedBy);
                setProfile(response.profile); 
                setBio(response.profile.bio); 
                setPerson(response.profile.user); 
                setFollows(response.profile.user.followedBy); 
                setPosts(response.profile.user.posts); 
                form.setFieldValue('bio', response.profile.bio);})
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
  <p>{user.username}</p>
  <Button onClick={() => toggleFollow(user.id)}>Follow</Button>
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
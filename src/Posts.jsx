import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./auth/AuthContext";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
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

const Posts = () => {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState([]);
    const [error, setError] = useState(false);
    const [load, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/post/followed", 
            { 
            mode: "cors",
            credentials: 'include',
        })
          .then((response) => response.json())
          .then((response) => {
            setLikes(response.posts.reduce((acc, post) => {
                acc[post.id] = post.like;
                return acc;
                }, {}));
            setLiked(response.posts.reduce((acc, post) => {
                acc[post.id] = post.like.some((like) => like.username === user.username);
                return acc;
                }, {}));
            setPosts(response.posts);})
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
      }, []);

      const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          content: '',
        },
         validate: {
      content: (value) => (value.length > 300 ? 'Post can\'t exceed 300 characters.' : null),
    },
      });

      const handleNewPost = async (event) => {
        try {
            event.preventDefault();
            const formData = form.getValues();
            const post = await fetch("http://localhost:3000/post/new",
                {
                mode: "cors" ,
                credentials: 'include',
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify(formData),
                }
            );
            const data = await post.json();
            navigate(`/post/${data.post.id}`);
        }
        catch(err) {
            console.error('Error making a new post', err);
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
                author={post.author.username}
                comment={post.comment.length}
                likeCount={likes[post.id].length} 
                handleLike={() => ToggleLike(post.id)} 
                liked={liked[post.id]} 
                />
            </div>
          )) : null;

    return (<div>
        <form onSubmit={handleNewPost}>
            <div className="flex flex-col items-center">
         <Textarea
      label="New Post"
      error="Posts can\'t exceed 300 characters"
      {...form.getInputProps('content')}
      key={form.key('content')}
    />
    <Button type="submit">Submit</Button>
    </div>
    </form>
    <div className="flex flex-col items-center gap-6 my-8 h-full max-h-9/10 overflow-scroll">{postscards}</div>
    </div>)
}

const PostsPage = () => {
    return (<div>
        <Header></Header>
        <Posts></Posts>
    </div>)
}

export default PostsPage;
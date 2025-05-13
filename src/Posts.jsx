import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { Textarea, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

//redirect to new post page after making post

const Post = ({id, content, author, createdAt, comment, like}) => {
    const postLink = `/post/${id}`

    return (<div>
        <p>{content}</p>
        <p>{createdAt}</p>
        <p>{author}</p>
        <Link to={postLink}>{comment} comment(s)</Link>
        <p>{like} like(s)</p>
    </div>)
}

const Posts = () => {

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(false);
    const [load, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/post/followed", 
            { 
            mode: "cors",
            credentials: 'include',
        })
          .then((response) => response.json())
          .then((response) => {console.log(response.posts); 
            setPosts(response.posts);})
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
      }, []);

      const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          content: '',
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
            console.log(post);

        }
        catch(err) {
            console.error('Error making a new post', err);
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
                like={post.like.length}
                />
            </div>
          )) : null;

    return (<div>
        <form onSubmit={handleNewPost}>
         <Textarea
      label="New Post"
      {...form.getInputProps('content')}
      key={form.key('content')}
    />
    <Button type="submit">Submit</Button>
    </form>
    <div>{postscards}</div>
    </div>)
}

const PostsPage = () => {
    return (<div>
        <Header></Header>
        <Posts></Posts>
    </div>)
}

export default PostsPage;
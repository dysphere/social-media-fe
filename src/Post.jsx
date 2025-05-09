import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "./Header"
import { Textarea, Button } from "@mantine/core"
import { useForm } from "@mantine/form"

const Comment = ({content, createdAt, author}) => {
    return(<div>
        <p>{content}</p>
        <p>{createdAt}</p>
        <p>{author}</p>
    </div>)
}

const Post = () => {

    const { id } = useParams();
    const [post, setPost] = useState({});
    const [author, setAuthor] = useState({});
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [error, setError] = useState(false);
    const [load, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3000/post/${id}`,
             { mode: "cors" ,
                credentials: 'include',
             })
          .then((response) => response.json())
          .then((response) => {console.log(response.post); setPost(response.post); setLikes(response.post.like); setComments(response.post.comment); setAuthor(response.post.author)})
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
      }, [id]);

      const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          content: '',
        },
      });

      const handleNewComment = async (id) => {
        try {
            const formData = form.getValues();
            const comment = await fetch(`http://localhost:3000/comment/${id}/new`,
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
            console.log(comment);

        }
        catch(err) {
            console.error('Error making a new comment', err);
        }
    }

    const commentscards = 
      !error && !load && comments ? comments.map((comment) => (
        <div key={comment.id}>
            <Comment
            content={comment.content}
            createdAt={comment.createdAt}
            author={comment.author.username}/>
        </div>
      )) : null;

    return (<div>
        <p>{author.username}</p>
        <p>{post.content}</p>
        <p>{post.createdAt}</p>
        <p>Comment</p>
        <form onSubmit={(e) => {e.preventDefault(); handleNewComment(post.id);}}>
            <Textarea 
      {...form.getInputProps('content')}
      key={form.key('content')}
    />
            <Button type="submit">Submit</Button>
        </form>
        <div>{commentscards}</div>
    </div>)
}

const PostPage = () => {
    return (<div>
        <Header></Header>
        <Post></Post>
    </div>)
}

export default PostPage;
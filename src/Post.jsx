import { useEffect, useState, useContext } from "react"
import { AuthContext } from "./AuthContext"
import { useParams } from "react-router-dom"
import Header from "./Header"
import { Textarea, Button } from "@mantine/core"
import { useForm } from "@mantine/form"

const Comment = ({id, content, createdAt, author, edit, 
    handleEditComment, handleDeleteComment, handleSubmitCommentEdit}) => {

    const { user } = useContext(AuthContext);

    return(<div>
        {user.username === author && edit ? 
        <form onSubmit={(e) => {e.preventDefault(); handleSubmitCommentEdit(id);}}>
            <Textarea/>
            <Button type="submit">Submit</Button>
        </form> : user.username === author && !edit ? 
        <div>
            <p>{content}</p>
            <Button onClick={handleEditComment}>Edit</Button>
            <Button onClick={handleDeleteComment}>Delete</Button>
            </div> :
        <p>{content}</p> }
        <p>{createdAt}</p>
        <p>{author}</p>
    </div>)
}

const Post = () => {

    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [post, setPost] = useState({});
    const [postContent, setPostContent] = useState("");
    const [author, setAuthor] = useState({});
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [error, setError] = useState(false);
    const [load, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/post/${id}`,
             { mode: "cors" ,
                credentials: 'include',
             })
          .then((response) => response.json())
          .then((response) => {
            const comment_edit = response.post.comment.map((comment) => {
                return {...comment, edit: false};
            });
            console.log(comment_edit);
            setPost(response.post); 
            setPostContent(response.post.content); 
            setLikes(response.post.like); 
            setComments(comment_edit); 
            setAuthor(response.post.author); 
            EditPostForm.setFieldValue('content', response.post.content);})
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
      }, [id]);

      const EditPostForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
          content: '',
        },
      });

      const EditCommentForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
          content: '',
        },
      });

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

    const handleEdit = () => {
        setEdit(true);
    }

    const cancelEdit = () => {
        setEdit(false);
    }

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3000/post/${id}/delete`,
                {
                mode: "cors" ,
                credentials: 'include',
                method: "DELETE",
                }
            );

        }
        catch(err) {
            console.error('Error deleting post', err);
        }
    }

    const submitEdit = async (id) => {
        try {
            const formData = EditPostForm.getValues();
            const post = await fetch(`http://localhost:3000/post/${id}/update`,
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
            const postData = await post.json();
            setPostContent(postData.post.content);
            setEdit(false);
            console.log(post);

        }
        catch(err) {
            console.error('Error editing post', err);
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
        {user.username === author.username && edit ?<div> 
        <form onSubmit={(e) => {e.preventDefault(); submitEdit(post.id);}}>
        <Textarea
        {...EditPostForm.getInputProps('content')}
        key={EditPostForm.key('content')}/>
        <Button onClick={cancelEdit}>Cancel</Button>
        <Button type="submit">Submit</Button>
        </form>
        <p>{post.createdAt}</p></div> : user.username === author.username && !edit ? 
        <div> <p>{postContent}</p>
        <p>{post.createdAt}</p>
        <Button onClick={handleEdit}>Edit</Button>
        <Button onClick={handleDelete}>Delete</Button></div> : 
        <div> <p>{postContent}</p>
        <p>{post.createdAt}</p></div>}
        <p></p>
        <p></p>
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
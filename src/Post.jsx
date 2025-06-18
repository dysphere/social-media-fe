import React, { useEffect, useState, useContext, useRef } from "react"
import { AuthContext } from "./auth/AuthContext"
import { useParams, useNavigate } from "react-router-dom"
import Header from "./Header"
import { Textarea, Button } from "@mantine/core"
import { useForm } from "@mantine/form"
import heartBlack from "../src/assets/heart-black.svg"
import heartOutline from '../src/assets/heart-outline.svg';

const Comment = ({id, content, createdAt, author, edit, 
    handleEditComment, handleDeleteComment, handleSubmitCommentEdit, 
    handleCancelForm, contentRef}) => {

    const { user } = useContext(AuthContext);

    const CommentEditForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
          content: content,
        },
      });

       useEffect(() => {
        if (contentRef) {
          contentRef.current = {
            getContent: () => CommentEditForm.getValues().content,
          };
        }
      }, [CommentEditForm, contentRef]);


    return(<div className="flex flex-col border-2 border-indigo-500 rounded-xl p-4 gap-1">
        {user.username === author && edit ? 
        <form onSubmit={(e) => {e.preventDefault(); handleSubmitCommentEdit(id);}}>
            <Textarea
             {...CommentEditForm.getInputProps('content')}
            key={CommentEditForm.key('content')}/>
            <Button onClick={handleCancelForm}>Cancel</Button>
            <Button type="submit">Submit</Button>
        </form> : user.username === author && !edit ? 
        <div>
            <p>{content}</p>
            <Button onClick={handleEditComment}>Edit</Button>
            <Button onClick={handleDeleteComment}>Delete</Button>
            </div>
             :
        <p>{content}</p> }
        <p>Posted: {createdAt}</p>
        <p>By: {author}</p>
    </div>)
}

const Post = () => {

    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const contentRefs = useRef({});
    let navigate = useNavigate();

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
            const comment_data = await comment.json();
            comment_data.edit = false;
            setComments([...comments, comment_data.comment]);
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
            navigate("/posts");
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

        }
        catch(err) {
            console.error('Error editing post', err);
        }
    }

    const CommentStartEdit = (id) => {
        setComments(comments.map((comment) => {
            if (id === comment.id) {
                return {...comment, edit: true};
            }
            return comment;
        }));
    }

    const CommentFormCancel = (id) => {
        setComments(comments.map((comment) => {
            if (id === comment.id) {
                return {...comment, edit: false};
            }
            return comment;
        }));
    }

    const CommentDelete = async (id) => {
        try {
            await fetch(`http://localhost:3000/comment/${id}/delete`,
                {
                mode: "cors" ,
                credentials: 'include',
                method: "DELETE",
                }
            );
            setComments(comments.filter((comment) => {
                return comment.id != id
            }));

        }
        catch(err) {
            console.error('Error deleting comment', err);
        }
    }

    const CommentEdit = async (id) => {
        try {
          const refObj = contentRefs.current[id];
          const content = refObj?.current?.getContent?.(); 
          if (content !== undefined) {
            const comment = await fetch(`http://localhost:3000/comment/${id}/update`,
               {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                  },
                credentials: 'include',
                mode: "cors",
                body: JSON.stringify({content}),
                }
            );
            const commentData = await comment.json();
            setComments(comments.map((comment) => {
            if (id === comment.id) {
                return {...comment, content: commentData.comment.content, edit: false};
            }
            return comment;
        }));
          }
        }
        catch(err) {
            console.error('Error editing comment', err);
        }
        }

    const handleLike = async (id) => {
         try {
            await fetch(`http://localhost:3000/post/${id}/like`,
                {
                mode: "cors" ,
                credentials: 'include',
                method: "PUT",
                }
            );
            const like_include_user = likes.some((liker) => {return liker.username === user.username});
            if (like_include_user) {
                setLikes(likes.filter((liker) => liker.username != user.username));
            }
            else {
                 setLikes([...likes, user]);
            }
        }
        catch(err) {
            console.error('Error toggling like', err);
        }
    }

    const commentscards = 
      !error && !load && comments ? comments.map((comment) => {
          if (!contentRefs.current[comment.id]) {
            contentRefs.current[comment.id] = React.createRef();
          }

          return (
            <div key={comment.id}>
              <Comment
                id={comment.id}
                content={comment.content}
                createdAt={comment.createdAt}
                author={comment.author.username}
                edit={comment.edit}
                contentRef={contentRefs.current[comment.id]} 
                handleEditComment={() => CommentStartEdit(comment.id)}
                handleDeleteComment={() => CommentDelete(comment.id)}
                handleSubmitCommentEdit={() => CommentEdit(comment.id)}
                handleCancelForm={() => CommentFormCancel(comment.id)}
              />
            </div>
          );
        })
      : null;

    return ( <div>
    <div className="flex flex-col items-center">
      {user.username === author.username && edit ? (
        <div> 
          <form onSubmit={(e) => {e.preventDefault(); submitEdit(post.id);}}>
            <Textarea {...EditPostForm.getInputProps('content')} key={EditPostForm.key('content')} />
            <Button onClick={cancelEdit}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </form>
          <p>{post.createdAt}</p>
        </div>
      ) : user.username === author.username && !edit ? (
        <div> 
          <p>{postContent}</p>
          <p>By: {author.username}</p>
          <p>Posted: {post.createdAt}</p>
          <Button onClick={() => handleEdit(post.id)}>Edit</Button>
          <Button onClick={() => handleDelete(post.id)}>Delete</Button>
        </div>
      ) : (
        <div> 
          <p>{postContent}</p>
          <p>By: {author.username}</p>
          <p>Posted: {post.createdAt}</p>
        </div>
      )}
      <div className="flex flex-row gap-4">
      <div  className="flex flex-row gap-1">
      {likes.some((liker) => {return user.username === liker.username}) ? (
        <button onClick={() => handleLike(post.id)} className="size-4">
          <img src={heartBlack} alt="Button Image" />
        </button>
      ) : (
        <button onClick={() => handleLike(post.id)} className="size-4">
          <img src={heartOutline} alt="Button Image" />
        </button>
      )}
      <p>{likes.length} like(s)</p>
      </div>
      <p>{comments.length} comment(s)</p>
      </div>
    </div>

    <p className="text-center">Comment</p>
    <form onSubmit={(e) => {e.preventDefault(); handleNewComment(post.id);}}>
      <div className="flex flex-col justify-center items-center">
        <div className="max-w-96">
      <Textarea {...form.getInputProps('content')} key={form.key('content')} />
      </div>
      <div>
      <Button type="submit">Submit</Button>
      </div>
      </div>
    </form>
    <div className="flex flex-col items-center gap-6 mt-10">{commentscards}</div>
  </div>)
}

const PostPage = () => {
    return (<div>
        <Header></Header>
        <Post></Post>
    </div>)
}

export default PostPage;
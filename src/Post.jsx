import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "./Header"

const Post = () => {

    const { id } = useParams();
    const [post, setPost] = useState({});
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
          .then((response) => {console.log(response.post); setPost(response.post)})
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
      }, [id]);

    return (<div></div>)
}

const PostPage = () => {
    return (<div>
        <Header></Header>
        <Post></Post>
    </div>)
}

export default PostPage;
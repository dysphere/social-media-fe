import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "./Header"

const Post = () => {

    const { id } = useParams();
    const [post, setPost] = useState({});

    useEffect(() => {
        fetch(`http://localhost:3000/post/${id}`,
             { mode: "cors" ,
                credentials: 'include',
             })
          .then((response) => response.json())
          .then((response) => {console.log(response.profile); setPost(response.post)})
          .catch((error) => console.error(error));
      }, []);

    return (<div></div>)
}

const PostPage = () => {
    return (<div>
        <Header></Header>
    </div>)
}

export default PostPage;
import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import Header from "./Header";

const Home = () => {
    const { isAuth } = useContext(AuthContext);

    return (<div>
        <Header></Header>
        {isAuth ? 
        <div className="text-center">Look at posts or other users!</div> : 
        <div className="text-center">Sign up or log in now!</div>}
    </div>)
}

export default Home;
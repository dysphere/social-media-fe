import { useParams } from "react-router-dom";
import Header from "./Header";

const Profile = () => {
    const { id } = useParams();

    return (<div></div>)
}

const ProfilePage = () => {
    return (<div>
        <Header></Header>
    </div>)
}

export default ProfilePage;
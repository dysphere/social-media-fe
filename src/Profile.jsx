import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";

const Profile = () => {

    const { id } = useParams();
    const [profile, setProfile] = useState({});

     useEffect(() => {
            fetch(`http://localhost:3000/profile/${id}`,
                 { mode: "cors" ,
                    credentials: 'include',
                 })
              .then((response) => response.json())
              .then((response) => {console.log(response.profile); setProfile(response.profile)})
              .catch((error) => console.error(error));
          }, []);

    return (<div></div>)
}

const ProfilePage = () => {
    return (<div>
        <Header></Header>
        <Profile></Profile>
    </div>)
}

export default ProfilePage;
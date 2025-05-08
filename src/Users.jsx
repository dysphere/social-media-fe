import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const User = ({username, profileId}) => {

    const profileLink = `/profile/${profileId}`

    return (<div>
        <Link to={profileLink}>{username}</Link>
    </div>)
}

const Users = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);
    const [load, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/user", 
            {
                credentials: 'include',
              })
          .then((response) => {
            if (response.status >= 400) {
              throw new Error("server error");
            }
            return response.json();
          })
          .then((response) => {console.log(response.users); setUsers(response.users);})
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
      }, []);

      const userscards = 
      !error && !load && users ? users.map((user) => (
        <div key={user.id}>
            <User
            username={user.username}
            profileId={user.profile.id}/>
        </div>
      )) : null;
    return (<div>{userscards}</div>)
}

const UsersPage = () => {
    return (<div>
        <Header></Header>
        <Users></Users>
    </div>)
}

export default UsersPage;
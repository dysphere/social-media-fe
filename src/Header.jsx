import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Menu, Center, Container, Burger, Group, Flex, Popover, NavLink, Button } from '@mantine/core';
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const {user, isAuth, removeAuth} = useContext(AuthContext);
    let navigate = useNavigate();

    const noauth_links = [
        { link: '/signup', label: 'Sign Up' },
        { link: '/login', label: 'Log In' },
      ];

    const auth_links = [
        { link: '/posts', label: 'Posts' },
        { link: '/users', label: 'Users' },
        {link: user?.profile?.id ?  `/profile/${user.profile.id}` : '#', label: 'Profile'},
    ];

      const noauth_items = noauth_links.map((link) => (
        <Link
        to={link.link}
        >
          {link.label}
        </Link>
      ));

      const auth_items = auth_links.map((link) => (
        <Link
        to={link.link}>
            {link.label}
        </Link>
    ));

    const handleLogout = async () => {
        
    };

    return (<div>
        {isAuth ? 
        <header>
            <Container fluid>
                <Flex className="flex justify-around">
                    <div>
                        <Link to="/">Home</Link>
                    </div>
                    <Group>{auth_items}
            <Button onClick={handleLogout}>Log Out</Button>
            </Group>
                </Flex>
            </Container>
        </header> : 
        <header>
            <Container fluid>
                <Flex className="flex justify-around">
                    <div>
                        <Link to="/">Home</Link>
                    </div>
                    <Group>{noauth_items}</Group>
                </Flex>
            </Container>
            </header>}
        </div>)
}

export default Header;
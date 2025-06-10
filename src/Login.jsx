import { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flex, Button, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import Header from './Header';

const Login = () => {

    const { addAuth } = useContext(AuthContext);
    const { state } = useLocation();
    let navigate = useNavigate();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          username: '',
          password: '',
        },
    
      });

     const handleLogin = async (event) => {
        try {
            event.preventDefault();
            const formData = form.getValues();
            const response = await fetch("http://localhost:3000/login",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                credentials: 'include',
                mode: "cors",
                body: JSON.stringify(formData),
                }
            );
            await response.json();
            if (response.ok) {
                addAuth();
                navigate(state?.path || "/");
            } else {
                console.error("Error logging in");
            }

        }
        catch(err) {
            console.error('Error logging in', err);
        }
    }

    return (<div className='flex justify-center'>
        <form onSubmit={handleLogin}>
            <TextInput
            label="Username"
            aria-label="Username"
            name="username"
            {...form.getInputProps('username')}
            key={form.key('username')}
            required/>
            <PasswordInput
            label="Password"
            aria-label="Password"
            name="password"
            {...form.getInputProps('password')}
            key={form.key('password')}
            required/>
            <Button type="submit">Log In</Button>
        </form>
    </div>)
}

const GuestLogin = () => {

    const { addAuth } = useContext(AuthContext);
    const { state } = useLocation();
    let navigate = useNavigate();

    const handleGuestLogin = async (event) => {
        try {
            event.preventDefault();
            const response = await fetch("http://localhost:3000/login",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                credentials: 'include',
                mode: "cors",
                body: JSON.stringify({"username": "Guest", "password": "GuestPassword"}),
                }
            );
            await response.json();
            if (response.ok) {
                addAuth();
                navigate(state?.path || "/");
            } else {
                console.error("Error logging in");
            }

        }
        catch(err) {
            console.error('Error logging in', err);
        }
    }

    return (<div>
        <form onSubmit={handleGuestLogin}>
                <Button type="submit">Guest Log In</Button>
            </form></div>)
}

const LoginPage = () => {
    return (
        <div>
            <div className='flex flex-col'>
            <Header></Header>
            <div className='flex justify-center items-center mt-20 gap-20'>
            <Login></Login>
            <GuestLogin></GuestLogin>
            </div>
            </div>
        </div>
    );
}

export default LoginPage;
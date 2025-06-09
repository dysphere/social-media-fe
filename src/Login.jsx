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

    //create guest login by having premade account with credentials filled out

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

const LoginPage = () => {
    return (
        <div>
            <Flex direction="column">
            <Header></Header>
            <Login></Login>
            </Flex>
        </div>
    );
}

export default LoginPage;
import { useNavigate } from 'react-router-dom';
import { Flex, Button, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import Header from './Header';

const Signup = () => {
    const navigate = useNavigate();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
        email: '',
          username: '',
          password: '',
          confirm_password: '',
        },
    
      });

    const handleSignup = async (event) => {
        try {
            event.preventDefault();
            const formData = form.getValues();
            const response = await fetch("http://localhost:3000/signup",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify(formData),
                }
            );
            await response.json();
             if (response.ok) {
                navigate("/login");
            } else {
                console.error("Error signing up");
            }

        }
        catch(err) {
            console.error('Error signing up', err);
        }
    }

    return (<div className='flex justify-center'>
        <form onSubmit={handleSignup}>
        <TextInput
            label="Email"
            aria-label="Email"
            name="email"
            {...form.getInputProps('email')}
            key={form.key('email')}
            required/>
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
            <PasswordInput
            label="Confirm Password"
            aria-label="Confirm Password"
            name="confirm_password"
            {...form.getInputProps('confirm_password')}
            key={form.key('confirm_password')}
            required/>
            <Button type="submit">Sign Up</Button>
        </form>
    </div>)
}

const SignupPage = () => {
    return (
        <div>
            <Flex direction="column">
            <Header></Header>
            <Signup></Signup>
            </Flex>
        </div>
    );
}

export default SignupPage;
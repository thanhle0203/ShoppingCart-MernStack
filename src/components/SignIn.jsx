import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

const SignIn = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const responseGoogle = async (response) => {
    try {
      const res = await axios.post('http://localhost:4000/api/users/oauth/google', {
        access_token: response.accessToken
      }, { withCredentials: true });
      
      console.log('res', res);
    } catch (error) {
      console.error('Axios request failed:', error);
    }
  };
  
  
  
  // const responseGoogle = (response) => {
  //   const access_token = response.accessToken;
  
  //   window.location.href = `http://localhost:4000/api/users/oauth/google/callback?access_token=${access_token}`;
  // };

  
  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/users/signin', {
        username,
        password
      });

      if (response.status === 200) {
        setUsername('');
        setPassword('');
        setError('');

        alert('Sign-in successful!');

        console.log(response.data);

        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log(token);

        setLoggedIn(true);

        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred during sign-in');
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign In</h2>
        <Form onSubmit={handleSignIn}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mt-3">
            Sign In
          </Button>
        </Form>

        {error && <p className="text-danger mt-3">{error}</p>}

        <br />

        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <GoogleLogin
          clientId="531044711977-9c3alvruearu5j92lu8i8lt0i53dpsvj.apps.googleusercontent.com"
          buttonText="Sign In with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy="single_host_origin"
          // redirectUri="http://localhost:4000/api/users/oauth/google/callback" // Add this line
          scope="email profile" // Include the required scopes here
        />
      </div>
    </Container>
  );
};

export default SignIn;

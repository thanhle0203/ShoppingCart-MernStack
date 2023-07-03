import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import GoogleSignIn from './GoogleSignIn';

const SignIn = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignInSuccess = async (response) => {
    // Handle successful sign-in with Google
    const { tokenId } = response;
    console.log('Google sign-in success:', tokenId);
  
    try {
      // Send the tokenId to your backend for verification and token generation
      const backendResponse = await axios.post('http://localhost:4000/api/users/google-signin', {
        tokenId
      });
  
      // Retrieve the generated token from the backend response
      const token = backendResponse.data.token;
  
      // Store the token in local storage or state for future use
      localStorage.setItem('token', token);
  
      // Update the logged-in status in your component
      setLoggedIn(true);
  
      // Redirect the user to the desired page
      // For example, you can use the `navigate` function from react-router-dom
      navigate('http://localhost:3000');
    } catch (error) {
      // Handle the error
      console.error('Error during Google sign-in:', error);
    }
  };

  const handleGoogleSignInFailure = (error) => {
    // Handle sign-in failure with Google
    console.error('Google sign-in failure:', error);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/users/signin', {
        username,
        password
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      );

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

        <br></br>
        
        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <GoogleSignIn 
        onGoogleSignInSuccess={handleGoogleSignInSuccess}
        onGoogleSignInFailure={handleGoogleSignInFailure}
      />
      </div>

      

    </Container>
  );
};

export default SignIn;

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend API for user sign-in
      const response = await axios.post('http://localhost:4000/api/users/signin', {
        username,
        password
      });

      // Check if the sign-in was successful
      if (response.status === 200) {
        // Clear the form inputs
        setUsername('');
        setPassword('');
        setError('');

        // Show a success message to the user
        alert('Sign-in successful!');

        // Redirect to the home page
        navigate('/');

      } else {
        // Show an error message to the user
        setError('Invalid credentials');
      }
    } catch (error) {
      // Show an error message to the user
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

        {error && <p className="text-danger text-center mt-3">{error}</p>}

        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </Container>
  );
};

export default SignIn;

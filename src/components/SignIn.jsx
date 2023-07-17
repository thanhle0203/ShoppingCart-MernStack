import React, { useState} from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { useEffect } from 'react';
import jwt_decode from "jwt-decode"
const SignIn = ({ setLoggedIn }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState({});

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

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject)
    setUser(userObject)
    document.getElementById('signInDiv').hidden = true;

    // Store the token in local storage
    const token = response.credential;
    console.log(token);
    localStorage.setItem('token', token)

    // Set the user as logged in
    setLoggedIn(true);
    
    // Redirect to homepage
    navigate('/');

  }

  function handleSignOut(e) {
    setUser({});
    document.getElementById('signInDiv').hidden = false;
  }
  
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "531044711977-9c3alvruearu5j92lu8i8lt0i53dpsvj.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });
  
    window.google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);
  

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

        {/* <GoogleLogin
          clientId="531044711977-9c3alvruearu5j92lu8i8lt0i53dpsvj.apps.googleusercontent.com"
          //buttonText="Sign In with Google"
          //callbackUrl="http://localhost:4000/api/users/google-signin/callback"
          callbackUrl="http://localhost:3000/login"
          onLogout={ () => alert ('You have been logged out')}
          cookiePolicy="single_host_origin"
          crossOrigin="true"
        /> */}
        
        <div id='signInDiv'></div>
        { Object.keys(user).length !== 0 & 
          <button onClick={ (e) => handleSignOut(e)}>Sign Out</button>
        }  
        
        { user && 
          <div>
            <h3>{user.name}</h3>
          </div>
        }
      </div>
    </Container>
  );
};



export default SignIn;

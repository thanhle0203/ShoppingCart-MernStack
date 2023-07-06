import React from 'react';
import { GoogleLogin } from 'react-google-login';

const GoogleSignIn = ({ onGoogleSignInSuccess, onGoogleSignInFailure }) => {
  const handleGoogleSignIn = async (response) => {
    try {
      const { tokenId } = response;
      console.log('Google sign-in success:', tokenId);

      // Send the tokenId to your backend for verification and token generation
      const backendResponse = await fetch('http://localhost:4000/api/users/google-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId }),
      });

      // Retrieve the generated token from the backend response
      const data = await backendResponse.json();
      const token = data.token;

      // Store the token in local storage or state for future use
      localStorage.setItem('token', token);

      // Update the logged-in status in your component
      onGoogleSignInSuccess();

      // Redirect the user to the desired page
      // For example, you can use the window.location.href or React Router navigate function
      window.location.href = 'http://localhost:3000';
    } catch (error) {
      // Handle the error
      console.error('Error during Google sign-in:', error);
      onGoogleSignInFailure(error);
    }
  };

  return (
    <GoogleLogin
      clientId="531044711977-9c3alvruearu5j92lu8i8lt0i53dpsvj.apps.googleusercontent.com"
      buttonText="Sign in with Google"
      onSuccess={handleGoogleSignIn}
      onFailure={onGoogleSignInFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleSignIn;

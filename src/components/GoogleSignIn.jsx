import React from 'react';
import { GoogleLogin } from 'react-google-login';

export const handleGoogleSignIn = async (onGoogleSignInSuccess, onGoogleSignInFailure) => {
    const googleClientId = "531044711977-9c3alvruearu5j92lu8i8lt0i53dpsvj.apps.googleusercontent.com";
  
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const response = await auth2.signIn({
        ux_mode: 'redirect',
      });
  
      onGoogleSignInSuccess(response);
    } catch (error) {
      onGoogleSignInFailure(error);
    }
  };
  
  const GoogleSignIn = ({ onGoogleSignInSuccess, onGoogleSignInFailure }) => {
    return (
      <GoogleLogin
        clientId="531044711977-9c3alvruearu5j92lu8i8lt0i53dpsvj.apps.googleusercontent.com"
        buttonText="Sign in with Google"
        onSuccess={() => handleGoogleSignIn(onGoogleSignInSuccess, onGoogleSignInFailure)}
        onFailure={onGoogleSignInFailure}
        cookiePolicy={'single_host_origin'}
      />
    );
  };
  
  export default GoogleSignIn;
  
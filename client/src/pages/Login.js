import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
} from '@mui/material';

function Login () {
  const navigate = useNavigate();
  const [ email, setEmail ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ error, setError ] = useState( '' );

  const handleEmailChange = ( e ) => {
    setEmail( e.target.value );
  };

  const handlePasswordChange = ( e ) => {
    setPassword( e.target.value );
  };

  const handleLogin = async ( e ) => {
    e.preventDefault();

    try {
      const response = await fetch( 'http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( {
          email,
          password,
        } ),
      } );

      const data = await response.json();

      if ( data.success ) {
        localStorage.setItem( 'token', data.data.token );
        navigate( '/' );
      } else {
        setError( data.message );
      }
    } catch ( error ) {
      setError( 'An error occurred. Please try again later.' );
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          {error && (
            <Box
              sx={{
                mt: 2,
                px: 2,
                py: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Login;

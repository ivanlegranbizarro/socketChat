import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
} from '@mui/material';

function Register () {
  const navigate = useNavigate();
  const [ email, setEmail ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ passwordConfirmation, setPasswordConfirmation ] = useState( '' );
  const [ name, setName ] = useState( '' );
  const [ errors, setErrors ] = useState( {} );

  const handleEmailChange = ( e ) => {
    setEmail( e.target.value );
  };

  const handlePasswordChange = ( e ) => {
    setPassword( e.target.value );
  };

  const handlePasswordConfirmationChange = ( e ) => {
    setPasswordConfirmation( e.target.value );
  };

  const handleNameChange = ( e ) => {
    setName( e.target.value );
  };

  const handleRegister = async ( e ) => {
    e.preventDefault();

    const errors = {};
    if ( !name ) {
      errors.name = 'Name is required';
    } else if ( name.length < 3 || name.length > 12 ) {
      errors.name = 'Name should be of minimum 3 and maximum 12 characters length';
    }

    if ( !email ) {
      errors.email = 'Email is required';
    } else if ( !/\S+@\S+\.\S+/.test( email ) ) {
      errors.email = 'Email is invalid';
    }

    if ( !password ) {
      errors.password = 'Password is required';
    } else if ( password.length < 6 || password.length > 12 ) {
      errors.password = 'Password should be of minimum 6 and maximum 12 characters length';
    }

    if ( !passwordConfirmation ) {
      errors.passwordConfirmation = 'Password confirmation is required';
    } else if ( passwordConfirmation !== password ) {
      errors.passwordConfirmation = 'Passwords must match';
    }

    if ( Object.keys( errors ).length ) {
      setErrors( errors );
      return;
    }

    try {
      const response = await fetch( 'http://localhost:4000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
          email,
          password,
          passwordConfirmation,
          name,
        } ),
      } );

      const data = await response.json();

      if ( data.success ) {
        localStorage.setItem( 'token', data.data.token );
        navigate( '/' );
      } else {
        setErrors( { general: data.message } );
      }
    } catch ( error ) {
      setErrors( { general: 'An error occurred. Please try again later.' } );
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
          Register
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={handleNameChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            margin="normal"
            fullWidth
            name="passwordConfirmation"
            label="Password Confirmation"
            type="password"
            id="passwordConfirmation"
            autoComplete="current-password"
            value={passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
            error={!!errors.passwordConfirmation}
            helperText={errors.passwordConfirmation}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Typography variant="body2" align="center">
            Have not an account yet?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#777' }}>
              Login
            </Link>
          </Typography>
          {errors.general && (
            <Typography variant="body2" color="error">
              {errors.general}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Register;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import SonicNo from '../images/NotFound.png';

function NotFound () {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate( '/' );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <img src={SonicNo} alt="Sonic saying no" style={{ width: '25%' }} />
      <Typography variant="h5" component="h1" mt={2} mb={3}>
        404 - Page Not Found
      </Typography>
      <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
        Oops! Looks like you stumbled upon a page that doesn't exist.
      </Typography>
      <Button variant="contained" onClick={handleNavigate} sx={{ mt: 3 }}>
        Take me home
      </Button>
    </Box>
  );
}

export default NotFound;

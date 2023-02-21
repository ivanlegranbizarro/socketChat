import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Header () {
  const [ anchorEl, setAnchorEl ] = React.useState( null );

  const handleClick = ( event ) => {
    setAnchorEl( event.currentTarget );
  };

  const handleClose = () => {
    setAnchorEl( null );
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          SocketChat
        </Typography>
        <Button color="inherit" component={Link} to="/chat">
          Chat
        </Button>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
        <Button color="inherit" component={Link} to="/signup">
          Signup
        </Button>
        <Button color="inherit" component={Link} to="/logout">
          Logout
        </Button>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean( anchorEl )}
        onClose={handleClose}
      >
        <MenuItem component={Link} to="/chat" onClick={handleClose}>
          Chat
        </MenuItem>
        <MenuItem component={Link} to="/login" onClick={handleClose}>
          Login
        </MenuItem>
        <MenuItem component={Link} to="/signup" onClick={handleClose}>
          Signup
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Header;

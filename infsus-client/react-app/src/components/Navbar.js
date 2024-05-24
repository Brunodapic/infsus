import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FcServices } from "react-icons/fc";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <FcServices size="30px"/> 

        <Typography padding="10px" variant="h6" style={{ flexGrow: 1 }}>
          SPK
        </Typography>
        <Button color="inherit" component={Link} to="/">Kvarovi</Button>
        <Button color="inherit" component={Link} to="/users">Majstori</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
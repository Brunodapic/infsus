import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { User } from '../models/entities/User';
import { UserRoleEnum } from '../models/enums/UserRoleEnum';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState(new User('', '', '', '', '', UserRoleEnum.Zaposlenik, '', '', ''));
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data.map(user => User.fromJson(user)));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const validateUser = (user) => {
    if (!user.korisnickoIme || user.korisnickoIme.length < 3) {
      return "Ime mora biti najmanje 3 znaka dugo.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateUser(newUser);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      if (editUser) {
        await axios.put(`/users/${editUser.id}`, newUser);
      } else {
        await axios.post('/users', newUser);
      }
      setNewUser(new User('', '', '', '', '', UserRoleEnum.Zaposlenik, '', '', ''));
      handleClose();
      fetchUsers();
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setNewUser(user);
    setOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <List>
        {users.map(user => (
          <ListItem key={user.id}>
            <ListItemText primary={user.korisnickoIme} secondary={user.role} />
            <Button variant="outlined" color="primary" onClick={() => handleEdit(user)}>
              Uredi
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => handleDelete(user.id)}>
              Obriši
            </Button>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Dodaj novog majstora
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editUser ? "Uredi Majstora" : "Novi Majstor"}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="korisnickoIme" label="Ime" fullWidth onChange={handleChange} value={newUser.korisnickoIme || ''} />
          {/* Dodajte dodatna polja za validaciju po potrebi */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Odustani
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editUser ? "Spremi" : "Dodaj"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;

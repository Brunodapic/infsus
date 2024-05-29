import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, Typography, ListItemText, Divider, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, ListItemButton } from '@mui/material';
import { User } from '../models/entities/User';
import { UserRoleEnum } from '../models/enums/UserRoleEnum';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState(new User('', '', '', '', '', '', '', UserRoleEnum.EMPLOYEE));
  const [selectedUser, setSelectedUser] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      var data = []

      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].role === UserRoleEnum.EMPLOYEE) {
          data.push(new User(
            response.data[i].id,
            response.data[i].username,
            response.data[i].email,
            response.data[i].password,
            response.data[i].firstName,
            response.data[i].lastName,
            response.data[i].gender,
            response.data[i].role,
          ));
        }
      }

      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const validateUser = (user) => {
    if (!selectedUser.username || selectedUser.username.length < 5) {
      return "Korisničko ime mora biti najmanje 5 znaka dugo.";
    }
    if (!selectedUser.email || selectedUser.username.email < 10) {
      return "E-mail mora biti najmanje 10 znakova dugo.";
    }
    return null;
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUserUpdateChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserUpdateSubmit = async () => {
    const validationError = validateUser(selectedUser);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const userToStr = {
        "role": selectedUser.role,
        "email": selectedUser.email,
        "username": selectedUser.username,
        "password": selectedUser.password
      };

      await axios.patch(`/users/${selectedUser.id}`, userToStr);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleUserSubmit = async () => {
    const validationError = validateUser(newUser);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const userToStr = {
        "role": UserRoleEnum.EMPLOYEE.toString(),
        "username": newUser.username,
        "email": newUser.email,
        "password": newUser.password
      };

      await axios.post(`/users`, userToStr);
      handleClose();
      setNewUser(new User('', '', '', '', '', '', '', UserRoleEnum.EMPLOYEE));
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleItemClick = (user) => {
    setSelectedUser(user);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(value.toLowerCase()) ||
        String(user.id).toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '30%' }}>
        <TextField
          label="Pretraži"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: '1rem',  marginTop: '1.25rem' }}
        /> 
        <List>
          {filteredUsers.map(user => (
            <ListItem key={user.id}>
              <ListItemButton onClick={() => handleItemClick(user)}>
                ID:{user.id} Korisničko ime:{user.username}
              </ListItemButton>
              <Button variant="outlined" color="secondary" onClick={() => handleDelete(user.id)}>
                Obriši
              </Button>
            </ListItem>
          ))}
        </List>
      </div>
      <Divider orientation="vertical" flexItem />
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        {selectedUser ? (
          <>
            <DialogContent>
              <DialogTitle variant="h5" fontWeight="bold">Odabrani majstor</DialogTitle>
              <TextField size="medium" margin="dense" name="username" label="Korisničko ime" fullWidth onChange={handleUserUpdateChange} value={selectedUser.username} />
              <TextField size="medium" margin="dense" name="userid" label="Id majstora" fullWidth value={selectedUser.id} />
              <TextField size="medium" margin="dense" name="firstName" label="Ime" fullWidth value={selectedUser.firstName || ''} />
              <TextField size="medium" margin="dense" name="lastName" label="Prezime" fullWidth value={selectedUser.lastName || ''} />
              <TextField size="medium" margin="dense" name="email" label="E-mail" fullWidth onChange={handleUserUpdateChange} value={selectedUser.email} />
              {/* <TextField size="medium" margin="dense" name="password" label="Password" fullWidth onChange={handleUserUpdateChange} value={selectedUser.password} /> */}
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleUserUpdateSubmit} color="primary">
                Ažuriraj
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => handleDelete(selectedUser.id)}>
                Obriši
              </Button>
            </DialogActions>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Dodaj novog majstora
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>{"Novi Majstor"}</DialogTitle>
              <DialogContent>
                <TextField margin="dense" name="username" label="Korisničko ime" fullWidth onChange={handleChange} value={newUser.username} />
                <TextField margin="dense" name="email" label="E-mail" fullWidth onChange={handleChange} value={newUser.email} />
                <TextField margin="dense" type="password" name="password" label="Password" fullWidth onChange={handleChange} value={newUser.password} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Odustani
                </Button>
                <Button onClick={handleUserSubmit} color="primary">
                  {"Dodaj majstora"}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Typography variant="h5" fontWeight="bold">Odaberite majstora s liste</Typography>
        )}
      </div>
    </div>
  );
};

export default Users;

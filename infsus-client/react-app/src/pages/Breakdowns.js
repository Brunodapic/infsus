import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Divider, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, ListItemButton, Select, MenuItem, InputLabel } from '@mui/material';
import { Breakdown } from '../models/entities/Breakdown'
import { BreakdownTypeEnum } from '../models/enums/BreakdownTypeEnum';
import { Task } from '../models/entities/Task';
import { TaskStatusEnum } from '../models/enums/TaskStatusEnum';
import { UserRoleEnum } from '../models/enums/UserRoleEnum';
import { User } from '../models/entities/User';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Breakdowns = () => {
  const [breakdowns, setBreakdowns] = useState([Breakdown]);
  const [filteredBreakdowns, setFilteredBreakdowns] = useState([Breakdown]);
  const [selectedBreakdown, setSelectedBreakdown] = useState();
  const [tasks, setTasks] = useState([Task]);
  const [openBreakdownDialog, setOpenBreakdownDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [newBreakdown, setNewBreakdown] = useState(new Breakdown('', BreakdownTypeEnum.Elektricni, '', '', '', ''));
  const [newTask, setNewTask] = useState(new Task('', '', 6, '', '', '', TaskStatusEnum.Dodijeljen, ''));
  const [newTask2, setNewTask2] = useState(new Task('', '', '', '', '', Date.now(), TaskStatusEnum.Dodijeljen, null));
  const [editingTask, setEditingTask] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [rok, setRok] = useState(null);

  useEffect(() => {
    fetchBreakdowns();
  }, []);

  const fetchBreakdowns = async () => {
    try {
      const response = await axios.get('/breakdowns');
      var data = [];
      var tasksForBreakdown = [];
      for (var i = 0; i < response.data.length; i++) {
        data.push(new Breakdown(
          response.data[i].id,
          response.data[i].BreakdownType,
          response.data[i].Naslov,
          response.data[i].Opis,
          response.data[i].Status,
          response.data[i].OrdererUserId,
          null,
          tasksForBreakdown,
          response.data[i].created,
          response.data[i].updated,
        ))
      }
      setBreakdowns(data);
      setFilteredBreakdowns(data);
    } catch (error) {
      console.error('Error fetching breakdowns:', error);
    }
  };

  const fetchTasks = async (byBackgroundId) => {
    try {
      const response = await axios.get(`/task/byBreakdownId/${byBackgroundId}`);
      var data = []

      for (var i = 0; i < response.data.length; i++) {
        data.push(new Task(
          response.data[i].id,
          response.data[i].breakdownId,
          response.data[i].MajstorID,
          response.data[i].AdminID,
          response.data[i].Opis,
          response.data[i].Rok,
          response.data[i].Status,
          null,
          response.data[i].updated,
          response.data[i].created
        ))
      }
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

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
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleItemClick = (breakdown) => {
    setSelectedBreakdown(breakdown);
    fetchTasks(breakdown.id);
    fetchUsers();
  };

  const handleOpenBreakdownDialog = () => {
    setOpenBreakdownDialog(true);
  };

  const handleCloseBreakdownDialog = () => {
    setOpenBreakdownDialog(false);
  };

  const handleOpenTaskDialog = () => {
    setOpenTaskDialog(true);
    setEditingTask(false);
  };

  const handleCloseTaskDialog = () => {
    setOpenTaskDialog(false);
  };

  const handleBreakdownChange = (e) => {
    setNewBreakdown({
      ...newBreakdown,
      [e.target.name]: e.target.value,
    });
  };

  const handleBreakdownUpdateChange = (e) => {
    setSelectedBreakdown({
      ...selectedBreakdown,
      [e.target.name]: e.target.value,
    });
  };

  const handleTaskChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleTask2Change = (e) => {
    // console.log("ušo sam")
    if(e.target.name === "rok"){
      console.log("ušo sam")
      var rok = new Date(e.target.value);
      setNewTask2({
        ...newTask2,
        [e.target.name]: rok,
      });
    }else{
      setNewTask2({
        ...newTask2,
        [e.target.name]: e.target.value,
      });
    }
  };

  const validateBreakdown = (breakdown) => {
    if (!breakdown.naslov || breakdown.naslov.length < 5) {
      return "Naslov mora biti najmanje 5 znakova dug.";
    }
    if (!breakdown.opis || breakdown.opis.length < 10) {
      return "Opis mora biti najmanje 10 znakova dug.";
    }
    return null;
  };

  const validateTask = (task) => {
    if (!task.status || task.status.length < 5) {
      return "Status mora biti najmanje 5 znakova dug.";
    }
    if (!task.rok) {
      return "Rok mora biti definiran.";
    }
    if (!task.majstorId) {
      return "Majstor Id mora biti pozitivan broj.";
    }
    if (!task.opis || task.opis.length < 10) {
      return "Opis mora biti najmanje 10 znakova dug.";
    }
    return null;
  };

  const handleBreakdownSubmit = async () => {
    const validationError = validateBreakdown(newBreakdown);
    if (validationError) {
      alert(validationError);
      return;
    }
    try {
      const breakdownToStr = {
        "BreakdownType": newBreakdown.breakdownType.toString(),
        "OrdererUserId": 1,
        "Naslov": newBreakdown.naslov,
        "Opis": newBreakdown.opis
      }
      await axios.post('/breakdowns', breakdownToStr);
      setNewBreakdown(new Breakdown('', BreakdownTypeEnum.Elektricni, '', '', '', ''));
      handleCloseBreakdownDialog();
      fetchBreakdowns();
    } catch (error) {
      console.error('Error creating breakdown:', error);
    }
  };

  const handleBreakdownUpdateSubmit = async () => {
    const validationError = validateBreakdown(selectedBreakdown);
    if (validationError) {
      alert(validationError);
      return;
    }
    try {
      const breakdownToStr = {
        "BreakdownType": selectedBreakdown.breakdownType.toString(),
        "Status": selectedBreakdown.status,
        "Naslov": selectedBreakdown.naslov,
        "Opis": selectedBreakdown.opis
      }
      await axios.patch(`/breakdowns/${selectedBreakdown.id}`, breakdownToStr);
      fetchBreakdowns();
    } catch (error) {
      console.error('Error updating breakdown:', error);
    }
  };

  const handleTaskSubmit = async () => {
    var validationError;
    if (editingTask) {
      validationError = validateTask(newTask)
    } else {
      validationError = validateTask(newTask2)
    }

    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      if (editingTask) {
        const newTaskStr = {
          "Opis": newTask.opis,
          "Status": newTask.status,
        }
        await axios.patch(`/task/${newTask.id}`, newTaskStr);
        setNewTask(new Task('', '', 6, '', '', '', TaskStatusEnum.Dodijeljen, null));
      } else {
        const newTaskStr = {
          "breakdownId": selectedBreakdown.id,
          "MajstorID": newTask2.majstorId,
          "AdminID": 5,
          "Opis": newTask2.opis,
          "Rok": rok.toUTCString(),
          "Status": newTask2.status,
          "breakdown": ""
        }
        console.log(newTaskStr)
        await axios.post(`/task`, newTaskStr);
        setNewTask2(new Task('', '', 6, '', '', Date.now(), TaskStatusEnum.Dodijeljen, null));
        setRok(null)
      }
      handleCloseTaskDialog();
      fetchTasks(selectedBreakdown.id);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleTaskEdit = (task) => {
    setEditingTask(true);
    setNewTask(task);
    setOpenTaskDialog(true);
  };

  const handleBreakdownDelete = async () => {
    try {
      await axios.delete(`/breakdowns/${selectedBreakdown.id}`);
      fetchBreakdowns();
      setSelectedBreakdown();
    } catch (error) {
      console.error('Error deleting breakdown:', error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`/task/${taskId}`);
      fetchTasks(selectedBreakdown.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === '') {
      setFilteredBreakdowns(breakdowns);
    } else {
      const filtered = breakdowns.filter(breakdown =>
        breakdown.naslov.toLowerCase().includes(value.toLowerCase()) ||
        String(breakdown.id).toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBreakdowns(filtered);
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
        <List component="nav">
          {filteredBreakdowns.sort((a, b) => a.id - b.id).map(breakdown => (
            <ListItemButton key={breakdown.id} onClick={() => handleItemClick(breakdown)}>
              ID:{breakdown.id} Naslov:{breakdown.naslov}
            </ListItemButton>
          ))}
        </List>
      </div>
      <Divider orientation="vertical" flexItem />
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        <Button variant="contained" color="primary" onClick={handleOpenBreakdownDialog}>
          Prijavi novi kvar
        </Button>
        <Dialog open={openBreakdownDialog} onClose={handleCloseBreakdownDialog}>
          <DialogTitle>Prijava kvara</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" name="naslov" label="Naslov" fullWidth value={newBreakdown.naslov} onChange={handleBreakdownChange} />
            <TextField size="medium" margin="dense" name="opis" label="Opis" fullWidth value={newBreakdown.opis} onChange={handleBreakdownChange} />
            <InputLabel id="demo-simple-select-label">Tip kvara</InputLabel>
            <Select margin='dense' name="breakdownType" fullWidth labelId="demo-simple-select-label" label="Tip kvara" value={newBreakdown.breakdownType} onChange={handleBreakdownChange}>
              <MenuItem value={BreakdownTypeEnum.Elektricni}>{BreakdownTypeEnum.Elektricni.toString()}</MenuItem>
              <MenuItem value={BreakdownTypeEnum.Hidraulicni}>{BreakdownTypeEnum.Hidraulicni.toString()}</MenuItem>
              <MenuItem value={BreakdownTypeEnum.Mehanicki}>{BreakdownTypeEnum.Mehanicki.toString()}</MenuItem>
              <MenuItem value={BreakdownTypeEnum.Pneumatski}>{BreakdownTypeEnum.Pneumatski.toString()}</MenuItem>
              <MenuItem value={BreakdownTypeEnum.Softverski}>{BreakdownTypeEnum.Softverski.toString()}</MenuItem>
              <MenuItem value={BreakdownTypeEnum.Strukturalni}>{BreakdownTypeEnum.Strukturalni.toString()}</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBreakdownDialog} color="primary">
              Odustani
            </Button>
            <Button onClick={handleBreakdownSubmit} color="primary">
              Prijavi kvar
            </Button>
          </DialogActions>
        </Dialog>
        {selectedBreakdown ? (
          <>
            <DialogContent>
              <DialogTitle variant="h5" fontWeight="bold">Odabrani kvar</DialogTitle>
              <TextField size="medium" margin="dense" name="naslov" label="Naslov kvara" fullWidth onChange={handleBreakdownUpdateChange} value={selectedBreakdown.naslov || ''} />
              <TextField size="medium" margin="dense" name="opis" label="Opis kvar" fullWidth onChange={handleBreakdownUpdateChange} value={selectedBreakdown.opis || ''} />
              <TextField size="medium" margin="dense" name="breakdown_id" label="ID kvara" fullWidth value={selectedBreakdown.id} />
              <InputLabel id="demo-simple-select-label">Tip kvara</InputLabel>
              <Select margin='dense' name="breakdownType" fullWidth labelId="demo-simple-select-label" label="Tip kvara" value={selectedBreakdown.breakdownType} onChange={handleBreakdownUpdateChange}>
                <MenuItem value={BreakdownTypeEnum.Elektricni}>{BreakdownTypeEnum.Elektricni.toString()}</MenuItem>
                <MenuItem value={BreakdownTypeEnum.Hidraulicni}>{BreakdownTypeEnum.Hidraulicni.toString()}</MenuItem>
                <MenuItem value={BreakdownTypeEnum.Mehanicki}>{BreakdownTypeEnum.Mehanicki.toString()}</MenuItem>
                <MenuItem value={BreakdownTypeEnum.Pneumatski}>{BreakdownTypeEnum.Pneumatski.toString()}</MenuItem>
                <MenuItem value={BreakdownTypeEnum.Softverski}>{BreakdownTypeEnum.Softverski.toString()}</MenuItem>
                <MenuItem value={BreakdownTypeEnum.Strukturalni}>{BreakdownTypeEnum.Strukturalni.toString()}</MenuItem>
              </Select>
              <TextField size="medium" margin="dense" name="breakdown_status" label="Status kvara" fullWidth value={selectedBreakdown.status} />
              <TextField size="medium" margin="dense" name="breakdown_created" label="Kvar kreiran" fullWidth value={selectedBreakdown.created} />
              <TextField size="medium" margin="dense" name="breakdown_updated" label="Kvar ažuriran" fullWidth value={selectedBreakdown.updated} />
              <TextField size="medium" margin="dense" name="breakdown_ordererId" label="ID naručitelja" fullWidth value={selectedBreakdown.ordererUserId} />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleBreakdownUpdateSubmit} color="primary">
                Ažuriraj kvar
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => handleBreakdownDelete(selectedBreakdown.id)}>
                Obriši
              </Button>
            </DialogActions>

            <Typography variant="h6" style={{ marginBottom: '1rem' }} fontWeight="bold">Zadaci</Typography>
            <List>
              {tasks.map(task => (
                <ListItem key={task.id} style={{ marginBottom: '1rem' }}>
                  <ListItemText primary={task.opis} secondary={task.status} />
                  <Button variant="outlined" color="primary" onClick={() => handleTaskEdit(task)} style={{ marginRight: '0.5rem' }}>
                    Uredi
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleTaskDelete(task.id)}>
                    Obriši
                  </Button>
                </ListItem>
              ))}
            </List>
            <Button variant="contained" color="primary" onClick={handleOpenTaskDialog}>
              Dodaj novi zadatak
            </Button>
            <Dialog fullScreen fullWidth open={openTaskDialog} onClose={handleCloseTaskDialog}>
              <DialogTitle>{editingTask ? "Uredi Zadatak" : "Novi Zadatak"}</DialogTitle>
              {editingTask ?
                <DialogContent>
                  <TextField margin="dense" name="opis" label="Opis" fullWidth onChange={handleTaskChange} value={newTask.opis || ''} />
                  <InputLabel id="demo-simple-select-label2">Status zadatka</InputLabel>
                  <Select margin='dense' name="status" fullWidth labelId="demo-simple-select-label2" label="Status zadatka" value={newTask.status} onChange={handleTaskChange}>
                    <MenuItem value={TaskStatusEnum.Dodijeljen}>{TaskStatusEnum.Dodijeljen.toString()}</MenuItem>
                    <MenuItem value={TaskStatusEnum.Ceka_Odobrenje}>{TaskStatusEnum.Ceka_Odobrenje.toString()}</MenuItem>
                    <MenuItem value={TaskStatusEnum.Pauziran}>{TaskStatusEnum.Pauziran.toString()}</MenuItem>
                    <MenuItem value={TaskStatusEnum.U_Tijeku}>{TaskStatusEnum.U_Tijeku.toString()}</MenuItem>
                    <MenuItem value={TaskStatusEnum.Zatvoren}>{TaskStatusEnum.Zatvoren.toString()}</MenuItem>
                    <MenuItem value={TaskStatusEnum.Zavrsen}>{TaskStatusEnum.Zavrsen.toString()}</MenuItem>
                  </Select>
                  {/* <TextField margin="dense" name="status" label="Status" fullWidth onChange={handleTaskChange} value={newTask.status || ''} /> */}
                  <TextField margin="dense" name="majstorId" label="ID majstora" fullWidth value={newTask.majstorId || ''} />
                  <TextField margin="dense" name="rok" label="Rok" fullWidth value={newTask.rok || ''} />
                  <TextField autoFocus margin="dense" name="adminId" label="ID admina" fullWidth value={newTask.adminId || ''} />
                  <TextField autoFocus margin="dense" name="created" label="Stvoren" fullWidth value={newTask.created || ''} />
                  <TextField autoFocus margin="dense" name="updated" label="Ažuriran" fullWidth value={newTask.updated || ''} />
                </DialogContent>
                :
                <DialogContent>
                  <InputLabel id="pickMajstorId">Odaberite majstora</InputLabel>
                  <Select margin="dense" name="majstorId" fullWidth labelId="pickMajstorId" label="Majstor" value={newTask2.majstorId} onChange={handleTask2Change}>
                    {users.map(user => (  
                      <MenuItem value={user.id}>{user.username}</MenuItem>
                    ))}
                  </Select>
                  <TextField margin="dense" name="opis" label="Opis" fullWidth onChange={handleTask2Change} value={newTask2.opis} />
                  {/* <TextField margin="dense" name="status" label="Status" fullWidth onChange={handleTask2Change} value={newTask2.status || ''} /> */}
                  <label id="demo-simple-select-label1">Status zadatka</label>
                  <Select margin='dense' name="status" fullWidth labelId="demo-simple-select-label1" label="Status zadatka" value={newTask2.status} onChange={handleTask2Change}>
                    <MenuItem value={TaskStatusEnum.Dodijeljen}>{TaskStatusEnum.Dodijeljen.toString()}</MenuItem>
                    <MenuItem value={TaskStatusEnum.Ceka_Odobrenje}>{TaskStatusEnum.Ceka_Odobrenje.toString()}</MenuItem>
                    <MenuItem value={TaskStatusEnum.Pauziran}>{TaskStatusEnum.Pauziran.toString()}</MenuItem>
                    <MenuItem value={TaskStatusEnum.U_Tijeku}>{TaskStatusEnum.U_Tijeku.toString()}</MenuItem>
                    <MenuItem value={TaskStatusEnum.Zatvoren}>{TaskStatusEnum.Zatvoren.toString()}</MenuItem>
                    <MenuItem value={TaskStatusEnum.Zavrsen}>{TaskStatusEnum.Zavrsen.toString()}</MenuItem>
                  </Select>
                  <Typography variant="h7">Rok</Typography>
                  <DatePicker scrollableMonthYearDropdown margin="dense" showIcon showPopperArrow  title="Rok" fullWidth onChange={(date) => setRok(date)} selected={rok} />
                  {/* <DateField margin="dense" name="rok" label="Rok" fullWidth onChange={handleTask2Change} value={newTask2.rok || ''} /> */}
                  {/* <TextField  margin="dense" name="rok" label="Rok" fullWidth onChange={handleTask2Change} value={newTask2.rok || ''}/> */}
                </DialogContent>
              }
              <DialogActions>
                <Button onClick={handleCloseTaskDialog} color="primary">
                  Odustani
                </Button>
                <Button onClick={handleTaskSubmit} color="primary">
                  {editingTask ? "Spremi" : "Dodaj"}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Typography variant="h5" fontWeight="bold" >Odaberite kvar s liste</Typography>
        )}
      </div>
    </div>
  );
};

export default Breakdowns;

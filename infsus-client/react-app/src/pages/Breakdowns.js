import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Divider, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, ListItemButton, Select, MenuItem, InputLabel } from '@mui/material';
import { Breakdown } from '../models/entities/Breakdown'
import { BreakdownTypeEnum } from '../models/enums/BreakdownTypeEnum';
import { Task } from '../models/entities/Task';
import { TaskStatusEnum } from '../models/enums/TaskStatusEnum';




const Breakdowns = () => {
  const [breakdowns, setBreakdowns] = useState([Breakdown]);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const [tasks, setTasks] = useState([Task]);
  const [openBreakdownDialog, setOpenBreakdownDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [newBreakdown, setNewBreakdown] = useState(new Breakdown('', BreakdownTypeEnum.Elektricni, '', '', '', ''));
  const [newTask, setNewTask] = useState(new Task('', '', '', '', '', '', TaskStatusEnum.Dodijeljen, null));
  const [editTask, setEditTask] = useState(null);
  const [breakdownTypeForm, setBreakdownTypeForm] = useState(null)

  useEffect(() => {
    fetchBreakdowns();
  }, []);

  const fetchBreakdowns = async () => {
    try {
      const response = await axios.get('/breakdowns');
      var data = [];
      var tasksForBreakdown = [];
      //console.log(response.data)
      for(var i = 0; i < response.data.length; i++){
        //tasksForBreakdown = await fetchTasks(response.data[i].id) 
        //console.log(tasksForBreakdown)
        data.push(new Breakdown(
           // id,breakdownType, naslov, opis, status, ordererUserId, ordererUser, tasks, created, updated
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
      //console.log(data)
      setBreakdowns(data)
      //setBreakdowns(response.data.map(breakdown => Breakdown.fromJson(breakdown)));
    } catch (error) {
      console.error('Error fetching breakdowns:', error);
    }
  };

  const fetchTasks = async (byBackgroundId) => {
    try {
      const response = await axios.get(`/task/byBreakdownId/${byBackgroundId}`);
      //console.log(response.data)
      var data = []

      for(var i = 0; i < response.data.length; i++){
        data.push(new Task(
           // id, breakdownId, majstorId, adminId, opis, rok, status, breakdown, created, updated
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
      //console.log(data)
      setTasks(data);
      //setTasks(response.data.map(task => Task.fromJson(task)));
      //console.log(tasks)
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };


  const handleItemClick = (breakdown) => {
    setSelectedBreakdown(breakdown);
    fetchTasks(breakdown.id);
  };

  const handleOpenBreakdownDialog = () => {
    setOpenBreakdownDialog(true);
  };

  const handleCloseBreakdownDialog = () => {
    setOpenBreakdownDialog(false);
  };

  const handleOpenTaskDialog = () => {
    setOpenTaskDialog(true);
  };

  const handleCloseTaskDialog = () => {
    setOpenTaskDialog(false);
    setEditTask(null);
  };

  const handleBreakdownChange = (e) => {
    setNewBreakdown({
      ...newBreakdown,
      [e.target.name]: e.target.value,
    });
  };

  const handleTaskChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
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
    if (!task.naslov || task.naslov.length < 5) {
      return "Naslov mora biti najmanje 5 znakova dug.";
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
    console.log(newBreakdown)
    try {
      const breakdownToStr = {
        "BreakdownType": newBreakdown.breakdownType.toString(),
        "OrdererUserId": 2,
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

  const handleTaskSubmit = async () => {
    const validationError = validateTask(newTask);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      if (editTask) {
        await axios.put(`/breakdowns/${selectedBreakdown.id}/tasks/${editTask.id}`, newTask);
      } else {
        await axios.post(`/breakdowns/${selectedBreakdown.id}/tasks`, newTask);
      }
      setNewTask(new Task('', '', '', '', '', '', TaskStatusEnum.Dodijeljen, null));
      handleCloseTaskDialog();
      fetchTasks(selectedBreakdown.id);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleTaskEdit = (task) => {
    setEditTask(task);
    setNewTask(task);
    setOpenTaskDialog(true);
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`/breakdowns/${selectedBreakdown.id}/tasks/${taskId}`);
      fetchTasks(selectedBreakdown.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <List component="nav" style={{ width: '30%' }}>
        {breakdowns.map(breakdown => (
          <ListItemButton key={breakdown.id} onClick={() => handleItemClick(breakdown)}>
            {breakdown.naslov} 
          </ListItemButton>
        ))}
      </List>
      <Divider orientation="vertical" flexItem />
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        {selectedBreakdown ? (
          <>
            <Typography variant="h5" style={{ marginBottom: '1rem' }}>{selectedBreakdown.naslov}</Typography>
            <Typography variant="body1" style={{ marginBottom: '1rem' }}>{selectedBreakdown.opis}</Typography>
            <Typography variant="h6" style={{ marginBottom: '1rem' }}>Zadaci</Typography>
            <List>
              {tasks.map(task => (
                <ListItem key={task.id} style={{ marginBottom: '1rem' }}>
                  <ListItemText primary={task.naslov} secondary={task.opis} />
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
            <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog}>
              <DialogTitle>{editTask ? "Uredi Zadatak" : "Novi Zadatak"}</DialogTitle>
              <DialogContent>
                <TextField autoFocus margin="dense" name="naslov" label="Naslov" fullWidth onChange={handleTaskChange} value={newTask.naslov || ''} />
                <TextField  margin="dense" name="opis" label="Opis" fullWidth onChange={handleTaskChange} value={newTask.opis || ''} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseTaskDialog} color="primary">
                  Odustani
                </Button>
                <Button onClick={handleTaskSubmit} color="primary">
                  {editTask ? "Spremi" : "Dodaj"}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Typography variant="h6">Odaberite kvar s liste</Typography>
        )}
        <Button variant="contained" color="primary" onClick={handleOpenBreakdownDialog}>
          Prijavi novi kvar
        </Button>
        <Dialog open={openBreakdownDialog} onClose={handleCloseBreakdownDialog}>
          <DialogTitle>Prijava kvara</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" name="naslov" label="Naslov" fullWidth onChange={handleBreakdownChange} value={newBreakdown.naslov} />
            <TextField size="medium" margin="dense" name="opis" label="Opis" fullWidth onChange={handleBreakdownChange} value={newBreakdown.opis} />
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
      </div>
    </div>
  );
};

export default Breakdowns;

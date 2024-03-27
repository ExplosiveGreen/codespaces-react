import { MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import UserService from '../../../services/UserService';
import { useNavigate } from 'react-router-dom';
import LocationService from '../../../services/LocationService';
function Signup() {
    const [newUser, setNewUser] = useState({})
    const navigate = useNavigate();
    const handleChange = ({ target }) => {
      const { name, value } = target;
      setNewUser({
        ...newUser,
        [name]:value
      });
    }
    const save = async () => {
      const geocode = await LocationService.getLocation(newUser.address);
      const result = UserService.addUser({
        ...newUser,
        address:{
          "longitude": geocode[1].lon,
          "latitude": geocode[1].lat
        },
      });
      if(result){
        navigate('/')
      }
    }
    return (
        <div>
          <Select
            value={newUser.auth}
            label="type"
            name='auth'
            onChange={handleChange}
          >
            <MenuItem value={"donator"}>Donator</MenuItem>
            <MenuItem value={"carrier"}>Carrier</MenuItem>
          </Select>
          <TextField label="Name" name="name" value={newUser.name} onChange={handleChange}/>
          <TextField label="Email" name="email" value={newUser.email} type='email' onChange={handleChange}/>
          <TextField label="Password" name="password" value={newUser.password} type='password' onChange={handleChange}/>
          <TextField label="Address" name="address" value={newUser.address} onChange={handleChange}/>
          <button type='submit' onClick={save}>submit</button>
        </div>
    );
  }
  
  export default Signup;
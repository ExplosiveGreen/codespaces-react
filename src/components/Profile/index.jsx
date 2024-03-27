import { MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import UserService from '../../../services/UserService';
import { setUser } from '../../../redux/actions/user';

import LocationService from '../../../services/LocationService';
import { useDispatch, useSelector } from 'react-redux';
function Profile() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [currUser, setCurrUser] = useState({})
    const handleChange = ({ target }) => {
      const { name, value } = target;
      setCurrUser({
        ...currUser,
        [name]:value
      });
    }
    useEffect(()=>{
        setCurrUser(user);
        const getData = async () => {
            if(user.location){
                const location = await LocationService.getAddress(user.location);
                setCurrUser({
                    ...user,
                    location:location.display_name
                })
            }
            if(user.address){
                const location = await LocationService.getAddress(user.address);
                setCurrUser({
                    ...user,
                    address:location.display_name
                })
            }
        }
        getData()
    },[user])
    const save = async () => {
      let updateUser = {...currUser}
      if(currUser.location){
        const geocode = await LocationService.getLocation(currUser.location);
        updateUser = {
            ...updateUser,
            location:{
                "longitude": geocode[1].lon,
                "latitude": geocode[1].lat
            },
        }
      }
      if(currUser.address){
        const geocode = await LocationService.getLocation(currUser.address);
        updateUser = {
            ...updateUser,
            address:{
                "longitude": geocode[1].lon,
                "latitude": geocode[1].lat
            },
        }
      }
      await UserService.updateUser(updateUser);
      dispatch(setUser(updateUser));
    }
    console.log(currUser)
    return (
        <div>
          <TextField label="Name" name="name" value={currUser.name} onChange={handleChange}/>
          <TextField label="Email" name="email" value={currUser.email} type='email' onChange={handleChange}/>
          <TextField label="Password" name="password" value={currUser.password} type='password' onChange={handleChange}/>
          {currUser.location && <TextField label="Location" name="location" value={typeof currUser.location == 'object' ? "" :currUser.location} onChange={handleChange}/>}
          {currUser.address && <TextField label="Address" name="address" value={typeof currUser.address == 'object' ? "" :currUser.address} onChange={handleChange}/>}
          <button type='submit' onClick={save}>submit</button>
        </div>
    );
  }
  
  export default Profile;
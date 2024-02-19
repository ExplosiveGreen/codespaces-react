import { useEffect, useState } from "react";
import UserService from "../../../services/UserService";
import { setUser } from '../../../redux/actions/user'
import { useDispatch } from "react-redux";
import { TextField } from "@mui/material";

function Login() {
    const [users, setUsers] = useState([])
    const [validUser, setValidUser] = useState({})
    const dispatch = useDispatch()
    useEffect(()=> {
        const getUsers = async () => {
            const users = await UserService.getAllUser();
            if (users) setUsers(users);
        }
        getUsers()
    },[])
    const handleChange = ({ target }) => {
        const { name, value } = target;
        setValidUser({
          ...validUser,
          [name]:value
        });
    }
    const login = () => {
        console.log(users,validUser)
        const validuser = users.find(item => item.email == validUser.email && item.password == validUser.password);
        console.log(validuser)
        if(validuser) dispatch(setUser(validuser));
    }
    return (
        <div>
          <TextField label="Email" name="email" value={validUser.email} type='email' onChange={handleChange}/>
          <TextField label="Password" name="password" value={validUser.password} type='password' onChange={handleChange}/>
          <button type='submit' onClick={login}>submit</button>
          <button
            aria-label="sign user"
            onClick={() => dispatch(setUser({auth:['org','donator','carrier']}))}
          >
            test login
          </button>
        </div>
    );
  }
  
  
  export default Login;
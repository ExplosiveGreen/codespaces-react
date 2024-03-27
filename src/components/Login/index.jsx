import { useEffect, useState } from "react";
import UserService from "../../../services/UserService";
import { setUser } from "../../../redux/actions/user";
import { useDispatch } from "react-redux";
import { Button, Container, TextField } from "@mui/material";
import { socket } from "../../../socket";
import { Link } from "react-router-dom";

function Login() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [validUser, setValidUser] = useState({});
  const dispatch = useDispatch();
  // useEffect(() => {
  //   // const getUsers = async () => {
  //   //   const users = await UserService.getAllUser();
  //   //   if (users) setUsers(users);
  //   // };
  //   // getUsers();

  // }, []);
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setValidUser({
      ...validUser,
      [name]: value,
    });
  };
  const login = async () => {
    const user1 = await UserService.getUser(
      validUser.email,
      validUser.password
    );
    if (user1 && Object.entries(user1).length > 0) {
      setUsers(user1);
      socket.connect();
      dispatch(setUser(user1[0]));

      // const validuser = users.find(
      //   (item) =>
      //     item.email == validUser.email && item.password == validUser.password
      // );
      // if (validuser) {
      // dispatch(user);
      setError(false);
    }

    //}
    else setError(true);
  };
  return (
    <div id="wrapper">
      <Container className="flex-form">
        <h1>Login</h1>
        <TextField
          id={error ? "outlined-basic" : "outlined-error"}
          error={error}
          className="text-field"
          label={error ? "Error" : "Email"}
          name="email"
          value={validUser.email}
          type="email"
          onChange={handleChange}
        />
        <TextField
          id={error ? "outlined-basic" : "outlined-error"}
          error={error}
          className="text-field"
          label={error ? "Error" : "Password"}
          name="password"
          value={validUser.password}
          type="password"
          onChange={handleChange}
        />
        <Button type="submit" onClick={login} variant="contained">
          submit
        </Button>
        <Link to='Signup' style={{'textDecoration':'none', 'color':'black' }}>Not a member? Sign Up</Link>
        {/* <button
            aria-label="sign user"
            onClick={() => dispatch(setUser({auth:['org','donator','carrier']}))}
          >
            test login
          </button> */}
      </Container>
    </div>
  );
}

export default Login;

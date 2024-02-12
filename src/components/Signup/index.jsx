import { useDispatch } from 'react-redux'
import { setUser } from '../../Redux-Actions/user'
function Signup() {
    const dispatch = useDispatch()
    return (
        <div>        <button
        aria-label="sign user"
        onClick={() => dispatch(setUser({auth:['org','donator']}))}
      >
        Increment
      </button></div>
    );
  }
  
  export default Signup;
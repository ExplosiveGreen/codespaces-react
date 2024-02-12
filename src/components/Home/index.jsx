import routes from '../../router';
import { useSelector } from 'react-redux';
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import Map from "../Map";


function Home() {
    const user = useSelector((state) => state.user.user)
    return (
        <PersistentDrawerLeft 
            headerText ='GiveHub'
            drawList = {routes.filter(item => (user && 'name','icon' in item && item.auth.some(item2 => user.auth.includes(item2))))}
        >
          <Map/>
        </PersistentDrawerLeft>
    )
  }
  
  export default Home;
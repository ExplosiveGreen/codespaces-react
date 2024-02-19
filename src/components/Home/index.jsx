import routes from '../../router';
import { useSelector } from 'react-redux';
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import Map from "../Map";
import { useState } from 'react';
import { useParams } from 'react-router-dom';


function Home() {
    const user = useSelector((state) => state.user.user)
    const [locations, setLocations] = useState([])
    let {generate} = useParams()
    return (
        <PersistentDrawerLeft 
            headerText ='GiveHub'
            drawList = {routes.filter(item => (user && 'name','icon' in item && item.auth.includes(user.__t)))}
        >
          <Map locations={locations} isDisplayRoute={Boolean(generate)} />
        </PersistentDrawerLeft>
    )
  }
  
  export default Home;
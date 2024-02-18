import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import E404 from './components/E404';
import HomeIcon from "@mui/icons-material/Home"
import DonatorDeliveries from './components/Donator/DonatorDeliveries';
import { DeliveryDining, VolunteerActivism } from '@mui/icons-material';
import DonatorDonations from './components/Donator/DonatorDonations';
export default [
      {
        path: "/",
        element: <Home/>,
        auth:['org','carrier','donator'],
        name: "Home",
        icon: <HomeIcon/>,
      },
      {
        path: "/deliveries",
        element: <DonatorDeliveries/>,
        auth:['donator'],
        name: "Deliveries",
        icon: <DeliveryDining/>,
      },
      {
        path: "/donations",
        element: <DonatorDonations/>,
        auth:['donator'],
        name: "Donations",
        icon: <VolunteerActivism/>,
      },
      {
        path: "/",
        element: <Login/>,
        auth:['noauth'],
      },
      {
        path: "/Signup",
        element: <Signup/>,
        auth:['noauth'],
      },
      {
        path: "*",
        element: <E404/>,
        auth:['noauth','org','carrier','donator']
      },
]
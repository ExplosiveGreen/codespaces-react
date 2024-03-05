import { useDispatch, useSelector } from "react-redux";
import Map from "../Map";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import UserService from "../../../services/UserService";
import { Style } from "@mui/icons-material";

function DonatorHome() {
  const user = useSelector((state) => state.user.user);
  const [locations, setLocations] = useState([]);
  const [check, setcheck] = useState(false);
  const [itemsList, setitemList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const filterOpen = Boolean(anchorEl);
  const handleFilterOpen = (event) => {
    if(anchorEl == event.currentTarget) handleFilterClose()
    else setAnchorEl(event.currentTarget)
  }
  const handleFilterClose = () => {
    console.log("handleFilterClose")
    setAnchorEl(null)
  } 
  let { generate } = useParams();

  const getLocations = async () => {
    if (user.__t !== "org") {
      if (user.__t == "donator") {
        const result = await UserService.getAllOrganizations();
        const new_list = result
          .filter((filter) => "location" in filter)
          .map((org) => {
            return {
              location: {
                lat: org.location.latitude,
                lng: org.location.longitude,
              },
              element: (
                <>
                  <List>
                    {org.donation_requests.map((dont) => (
                      <ListItem>
                        <List>
                          {dont.items.map(({ name, amount }) => (
                            <ListItem>
                              <ListItemText primary={`${name} : ${amount}`} />
                              
                            </ListItem>
                          ))}
                        </List>
                        <Button>Accept</Button>
                      </ListItem>
                    ))}
                  </List>
                </>
              ),
            };
          });
        setLocations(new_list);
      }
    }
  };
  useEffect(() => {
    getLocations();
  }, []);
  return (
        <div style={{position: 'relative'}}>
        <Map locations={locations} isDisplayRoute={Boolean(generate)} />
        <div style={{position:'absolute',right:'20%', bottom:'10%'}}>
        <Button style={{ background: 'blue', color:'white'}} onClick={handleFilterOpen}>Filter</Button>
        <Menu
         anchorEl={anchorEl}
         open={filterOpen}
         onClose={handleFilterClose}
         style={{
          transform: "translateY(-12%)" 
         }}
         >
          <MenuItem><Checkbox value={check} onClick={()=> setcheck(!check)}/>have donation request</MenuItem>
          <MenuItem></MenuItem>
          <MenuItem>yinon</MenuItem>
         </Menu>
        </div>
        </div>
  );
}

export default DonatorHome;

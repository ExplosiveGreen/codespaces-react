import { useDispatch, useSelector } from "react-redux";
import Map from "../Map";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import UserService from "../../../services/UserService";

function DonatorHome() {
  const user = useSelector((state) => state.user.user);
  const [locations, setLocations] = useState([]);
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
        <Map locations={locations} isDisplayRoute={Boolean(generate)} />  
  );
}

export default DonatorHome;

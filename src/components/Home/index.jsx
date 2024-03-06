import routes from "../../router";
import { useDispatch, useSelector } from "react-redux";
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import Map from "../Map";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyTable from "../MyTable";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import DonationService from "../../../services/DonationService";
import UserService from "../../../services/UserService";
import { setUser } from "../../../redux/actions/user";
import OrgHome from "./OrgHome";
import DonatorHome from "./DonatorHome";
import CarrierHome from "./CarrierHome";

function Home() {
  const user = useSelector((state) => state.user.user);
  const [locations, setLocations] = useState([]);
  const [donationForm, setDonationForm] = useState(false);
  const [item, setItem] = useState({});
  const [items, setItems] = useState([]);
  const [editDonation, setEditDonation] = useState(null)
  let { generate } = useParams();
  const dispatch = useDispatch();
  console.log(user)

  const columns = [
    { id: "id", label: "ID", accessor: (row) => row._id },
    {
      id: "items",
      label: "items",
      accessor: (row) => (
        <List>
          {row.items.map(({ name, amount }) => (
            <ListItem>
              <ListItemText primary={`${name} : ${amount}`} />
            </ListItem>
          ))}
        </List>
      ),
    },
    { id: "status", label: "Status", accessor: (row) => row.status },
    {
      id: "actions",
      lable: "Actations",
      accessor: (row) => (
        <>
          <Button
            onClick={() => {
              setItems(row.items);
              setEditDonation(row)
              setDonationForm(true);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              deleteDonationRequest(row._id);
            }}
          >
            delete
          </Button>
        </>
      ),
    },
  ];

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
  const deleteDonationRequest = async (id) => {
    console.log(id);
  };
  const saveDonation = async (event) => {
    event.preventDefault();
    let newUser;
    if (!editDonation) {
      const resultId = await DonationService.putDonationRequest({
        items,
        status: "Pending",
      });
      if (resultId) {
        newUser = {
          ...user,
          donation_requests: [...(user.donation_requests || []), resultId],
        };
        console.log('add',newUser)
        const result = await UserService.putDonationOrganization(
          user._id,
          newUser
        );
      }
    } else {
      const resultId = await DonationService.updateDonationRequest({
        ...editDonation,
        items,
      });
      console.log(resultId)
      newUser = {
        ...user,
        donation_requests: [...(user.donation_requests || [])],
      };
    }
    dispatch(setUser(newUser));
    setDonationForm(false);
  };
  useEffect(() => {
    getLocations();
  }, []);
  return (
    <PersistentDrawerLeft
      headerText="GiveHub"
      drawList={routes.filter(
        (item) => (
          user && "name", "icon" in item && item.auth.includes(user.__t)
        )
      )}
    >
      {user.__t == "org" && (
        <OrgHome />
      )}
      {user.__t == "donator" && (
        <DonatorHome/>
      )}
      {user.__t == "carrier" && (
        <CarrierHome/>
      )}
    </PersistentDrawerLeft>
  );
}

export default Home;

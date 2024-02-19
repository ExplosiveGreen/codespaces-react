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
import {setUser} from "../../../redux/actions/user";

function Home() {
  const user = useSelector((state) => state.user.user);
  const [locations, setLocations] = useState([]);
  const [donationForm, setDonationForm] = useState(false);
  const [item, setItem] = useState({});
  const [items, setItems] = useState([]);
  let { generate } = useParams();
  const dispatch = useDispatch()

  const getLocations = async () => {
    if (user.__t !== "org") {
      if (user.__t == "donator") {
        const result = await UserService.getAllOrganizations();
        setLocations(
          result.map((org) => {
            return {
              location: {
                lat: org.location.latitude,
                lng: org.location.longitude,
              },
              element: (
                <>
                  <List>
                    {org.donation_requests.map((dont) =>
                      <ListItem><List>
                        {dont.items.map(({ name, amount }) => (
                          <ListItem>
                            <ListItemText primary={`${name} : ${amount}`} />
                          </ListItem>
                        ))}
                        </List>
                        <Button>Accept</Button>
                      </ListItem>
                    )}
                  </List>
                </>
              ),
            };
          })
        );
      }
    }
  };
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
  ];
  const saveDonation = async (event) => {
    event.preventDefault();
    const resultId = await DonationService.putDonationRequest({
      items,
      status: "Pending",
    });
    if (resultId) {
      const result = await UserService.putDonationOrganization(
        user._id,
        resultId
      );
      setDonationForm(false);
      const newUser = await UserService.getUserById(user._id)
      if(newUser) dispatch(setUser(newUser))
    }
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
      {user.__t !== "org" && locations && (
        <Map locations={locations} isDisplayRoute={Boolean(generate)} />
      )}
      {user.__t == "org" && (
        <>
          <Button onClick={() => setDonationForm(true)}>
            Add Donation Request
          </Button>
          <MyTable columns={columns} tableData={user.donation_requests} />
          <Dialog
            open={donationForm}
            onClose={() => setDonationForm(false)}
            PaperProps={{
              component: "form",
              onSubmit: saveDonation,
            }}
          >
            <DialogTitle>Add donation request</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="name"
                label="Item name"
                onChange={({ target }) =>
                  setItem({ ...item, [target.name]: target.value })
                }
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="amount"
                label="amount"
                type="number"
                onChange={({ target }) =>
                  setItem({ ...item, [target.name]: parseInt(target.value) })
                }
              />
              <Button
                onClick={() => {
                  setItems([...items, item]);
                  setItem({});
                }}
              >
                Add
              </Button>
              <List>
                {items.map(({name,amount}) => (
                  <ListItem>
                  <ListItemText primary={`${name} : ${amount}`} />
                </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDonationForm(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </PersistentDrawerLeft>
  );
}

export default Home;

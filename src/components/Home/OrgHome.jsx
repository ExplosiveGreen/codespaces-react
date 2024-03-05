import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
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

function OrgHome() {
  const user = useSelector((state) => state.user.user);
  const [donationForm, setDonationForm] = useState(false);
  const [item, setItem] = useState({});
  const [items, setItems] = useState([]);
  const [editDonation, setEditDonation] = useState(null);
  const dispatch = useDispatch();

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
              setEditDonation(row);
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

  const deleteDonationRequest = async (id) => {
    const result = await DonationService.deleteDonationRequest(id);
    dispatch(setUser({
      ...user,
      donation_requests: (user.donation_requests || []).filter(dr => dr._id != id),
    }))
  };
  const saveDonation = async (event) => {
    event.preventDefault();
    let newUser = { ...user };
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
      if (resultId) {
        newUser = {
          ...user,
          donation_requests: user.donation_requests.map((i) => {
            if (i._id == editDonation._id) return resultId;
            return i;
          }),
        };
      }
    }
    dispatch(setUser(newUser));
    setDonationForm(false);
  };
  return (<>
      <Button
        onClick={() => {
          setEditDonation(null);
          setDonationForm(true);
        }}
      >
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
        <DialogTitle>
          {!editDonation ? "Add" : "Edit"} donation request
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Item name"
            value={item.name || ""}
            onChange={({ target }) =>
              setItem({ ...item, [target.name]: target.value })
            }
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="amount"
            label="amount"
            type="number"
            value={item.amount || ""}
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
            {items.map(({ name, amount }, index) => (
              <ListItem>
                {/* <ListItemText primary={`${name} : ${amount}`} /> */}
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  value={name}
                  onChange={({ target }) => {
                    const new_item = { name: target.value, amount };
                    setItems(
                      items.map((i, ind) => {
                        if (ind == index) return new_item;
                        return i;
                      })
                    );
                  }}
                />
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="amount"
                  type="number"
                  value={amount}
                  onChange={({ target }) => {
                    const new_item = { name, amount: target.value };
                    setItems(
                      items.map((i, ind) => {
                        if (ind == index) return new_item;
                        return i;
                      })
                    );
                  }}
                />
                <Button
                  onClick={() => {
                    setItems(items.filter((i, ind) => ind != index));
                  }}
                >
                  Del
                </Button>
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
  );
}

export default OrgHome;

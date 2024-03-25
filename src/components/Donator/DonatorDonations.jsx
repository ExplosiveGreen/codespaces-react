import routes from '../../router';
import { useDispatch, useSelector } from 'react-redux';
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, TextField } from '@mui/material';
import DonationService from '../../../services/DonationService';
import MyTable from '../MyTable';
import { setUser } from '../../../redux/actions/user';


function DonatorDonations() {
  const [tableData, setTableData] = useState([])
  const [items, setItems] = useState([]);
  const [editDonation, setEditDonation] = useState(null);
  const [donationForm, setDonationForm] = useState(false);
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  useEffect(() => {
    setTableData(user.donations);
  }, [user]);
  const columns = [
    { id: 'id', label: 'ID', accessor: (row) => row._id },
    {
      id: 'items', label: 'items', accessor: (row) =>
        <List>
          {(row.items || []).map(({ name, amount }) => (
            <ListItem>
              <ListItemText primary={`${name} : ${amount}`} />
            </ListItem>
          ))}
        </List>
    },
    { id: 'status', label: 'Status', accessor: (row) => row.status },
    {
      id: 'actions', label: 'Actions', accessor: (row) => {
        return <>
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
              deleteDonation(row._id);
            }}
          >
            delete
          </Button>
        </>
      }
    }
  ];
  const deleteDonation = async (id) => {
    const result = await DonationService.deleteDonationRequest(id);
    dispatch(setUser({
      ...user,
      donations: (user.donations || []).filter(dr => dr._id != id),
    }))
  }
  const saveDonation = async (event) => {
    event.preventDefault();
    const resultId = await DonationService.updateDonationRequest({
      ...editDonation,
      items,
    });
    if (resultId) {
      const newUser = {
        ...user,
        donations: user.donations.map((i) => {
          if (i._id == editDonation._id) return resultId;
          return i;
        }),
      }
      dispatch(setUser(newUser))
    }
    setDonationForm(false);
  }
  return (
    <PersistentDrawerLeft
      headerText='GiveHub'
      drawList={routes.filter(item => (user && 'name', 'icon' in item && item.auth.includes(user.__t)))}
    >
      <Box sx={{ width: '100%' }}>
        <MyTable columns={columns} tableData={tableData} />
        <Dialog
          open={donationForm}
          onClose={() => setDonationForm(false)}
          PaperProps={{
            component: "form",
            onSubmit: saveDonation,
          }}
        >
          <DialogTitle>
            Edit donation request
          </DialogTitle>
          <DialogContent>
            <List>
              {items.map(({ name, amount }, index) => (
                <ListItem>
                  <TextField
                    autoFocus
                    required
                    disabled
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
      </Box>
    </PersistentDrawerLeft>
  )
}

export default DonatorDonations;
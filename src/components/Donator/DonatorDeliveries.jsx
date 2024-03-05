import routes from '../../router';
import { useSelector } from 'react-redux';
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogTitle } from '@mui/material';
import MyTable from '../MyTable';
import DeliveryService from '../../../services/DeliveryService';


function DonatorDeliveries() {
  const [tableData, setTableData] = useState([])
  const [editDelivery, setEditDelivery] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState(false);
  const user = useSelector((state) => state.user.user)
  useEffect(() => {
    const fetchData = async () => {
      const resultPromise = user.delivery_requests.map(async (delivery) => {
        const data = await DeliveryService.getDeliverieById(delivery);
        return data;
      })
      const result = await Promise.all(resultPromise)
      setTableData(result)
    }
    fetchData()
  }, []);
  const deleteDelivery = async (id) => {
    const result = await DeliveryService.deleteDelivery(id);
    dispatch(setUser({
      ...user,
      delivery_requests: (user.delivery_requests || []).filter(dr => dr != id),
    }))
  }
  const columns = [
    { id: 'id', label: 'ID', accessor: (row) => row._id },
    { id: 'donator', label: 'Donator', accessor: (row) => row.donator.name },
    { id: 'organization', label: 'Organization', accessor: (row) => row.organization.name },
    { id: 'delivery_date', label: 'Delivery Date', accessor: (row) => row.delivery_date },
    { id: 'status', label: 'Status', accessor: (row) => row.status },
    {
      id: 'actions', label: 'Actions', accessor: (row) => {
        return <>
          <Button
            onClick={() => {
              setEditDelivery(row);
              setDeliveryForm(true);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              deleteDelivery(row._id);
            }}
          >
            delete
          </Button>
        </>
      }
    }
  ];
  return (
    <PersistentDrawerLeft
      headerText='GiveHub'
      drawList={routes.filter(item => (user && 'name', 'icon' in item && item.auth.includes(user.__t)))}
    >
      <Box sx={{ width: '100%' }}>
        <MyTable columns={columns} tableData={tableData} />
        <Dialog
          open={deliveryForm}
          onClose={() => setDeliveryForm(false)}
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

export default DonatorDeliveries;
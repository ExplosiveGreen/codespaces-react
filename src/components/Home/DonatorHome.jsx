import { useDispatch, useSelector } from "react-redux";
import Map from "../Map";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import UserService from "../../../services/UserService";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import DonationService from "../../../services/DonationService";
import { setUser } from "../../../redux/actions/user";
import DeliveryService from "../../../services/DeliveryService";

function DonatorHome() {
  const user = useSelector((state) => state.user.user);
  const [locations, setLocations] = useState([]);
  const [check, setcheck] = useState(false);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const [customeAmount, setCustomeAmount] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [acceptDonation, setAcceptDonation] = useState(null);
  const [acceptOrg, setAcceptOrg] = useState(null);
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState(dayjs())
  const [anchorEl, setAnchorEl] = useState(null);
  const filterOpen = Boolean(anchorEl);
  const dispatch = useDispatch();
  const handleFilterOpen = (event) => {
    if (anchorEl == event.currentTarget) handleFilterClose()
    else setAnchorEl(event.currentTarget)
  }
  const createDelivery = async (event) => {
    event.preventDefault();
    const delivery = {
      delivery_date: deliveryDate.format('YYYY-MM-DDTHH:MM:00.00'),
      donations: acceptDonation,
      donator: user,
      organization: acceptOrg,
      status: 'Pending'
    }
    const deliveryResult = await DeliveryService.addDelivery(delivery);
    if (deliveryResult._id) {
      const newUser = {
        ...user,
        delivery_requests: [...user.delivery_requests, deliveryResult._id]
      }
      const newOrg = {
        ...acceptOrg,
        deliveries: [...acceptOrg.deliveries, deliveryResult._id]
      }
      await UserService.updateUser(newUser);
      await UserService.updateUser(newOrg);
      dispatch(setUser(newUser));
      await getOrganizations();
    }
    setDeliveryOpen(false)
  }
  const saveDonation = async (donation, org) => {
    let cmd = customeAmount.find(ca => ca._id == donation._id)
    cmd = {
      ...cmd,
      items: cmd.items.map(i => i || 0)
    }
    const flag = cmd.items.reduce((agg, val,index) => agg && val == donation.items[index], true)
    if (flag) {
      (await DonationService.updateDonationRequest({
        ...donation,
        status: 'Accepted',
      }))
      const orgUser = {
        ...org,
        donation_requests: org.donation_requests.map(dr => dr._id).filter(dr => dr != donation._id),
        donations: [...org.donations, donation._id]
      }
      const donatorUser = {
        ...user,
        donations: [...user.donations, donation._id]
      }
      await UserService.updateUser(orgUser);
      await UserService.updateUser(donatorUser);
      setAcceptOrg(orgUser)
      setAcceptDonation({
        ...donation,
        status: 'Accepted',
      })
      dispatch(setUser(donatorUser));
    } else {
      console.log(org)
      const donationResult = await DonationService.putDonationRequest({
        status: 'Accepted',
        items: cmd.items.map((i, index) => { return { name: donation.items[index].name, amount: i } })
      })
      setAcceptDonation({
        status: 'Accepted',
        items: cmd.items.map((i, index) => { return { name: donation.items[index].name, amount: i } })
      })
      await DonationService.updateDonationRequest({
        ...donation,
        items: donation.items.map(({ name, amount }, ind) => { return { name, amount: amount - cmd.items[ind] } })
      })
      if (donationResult) {
        const donatorUser = {
          ...user,
          donations: [...user.donations.map(v => v._id), donationResult._id]
        }
        const orgUser = {
          ...org,
          donations: [...org.donations, donationResult._id]
        }
        await UserService.updateUser(orgUser);
        await UserService.updateUser(donatorUser);
        setAcceptOrg(orgUser)
        dispatch(setUser(donatorUser));
      }
    }
    setDeliveryOpen(true)
  }
  const handleFilterClose = () => {
    setAnchorEl(null)
  }
  let { generate } = useParams();
  const getOrganizations = async () => {
    const result = await UserService.getAllOrganizations();
    setOrganizations((Array.isArray(result) ? result : []).filter((filter) => "location" in filter));
  }
  const initCustomeAmount = () => {
    let ca = []
    organizations.map((org) => {
      org.donation_requests.map(({ _id, items }) => {
        ca = [...ca, { _id, items: (items || []).map((item) => { return item.amount }) }]
      })
    })
    return ca;
  }
  const getLocations = (orgList = organizations) => {
    return (Array.isArray(orgList) ? orgList : [])
      .map((org) => {
        return {
          location: {
            lat: org.location.latitude,
            lng: org.location.longitude,
          },
          element: (
            <>
              <List>
                {(org.donation_requests || []).map((dont) => { 
                  const cmd = customeAmount.find(ca => ca._id == dont._id);
                  return (
                  <ListItem>
                    <List>
                      {dont.items.map(({ name, amount }, index) => {
                        const error = !(((customeAmount.find(ca => ca._id == dont._id) || []).items || [])[index]);
                      return (
                      <ListItem>
                        <ListItemText primary={`${name} : ${amount}`} />
                        <TextField
                          autoFocus
                          id={error ? "outlined-basic" : "outlined-error"}
                          error={error && "must be a number biger then 0"}
                          margin="dense"
                          name="amount"
                          label="amount"
                          type="number"
                          value={(Array.isArray(customeAmount) && customeAmount.length != 0) ? customeAmount.find(ca => ca._id == dont._id).items[index] : 0}
                          onChange={({ target }) => {
                            const ca = [
                              ...(customeAmount.filter(ca => ca._id != dont._id) || []),
                              { _id: dont._id, items: customeAmount.find(ca => ca._id == dont._id).items.map((value, ind) => ind == index ? parseInt(target.value) : value) }
                            ]
                            setCustomeAmount(ca)
                          }
                          }
                        />
                      </ListItem>
                      )})}
                    </List>
                    <Button disabled={cmd && !cmd.items.reduce((agg, val) => agg && val, true)} onClick={async () => await saveDonation(dont, org)}>Accept</Button>
                  </ListItem>
                )})}
              </List>
            </>
          ),
        };
      });
  };
  const getItems = () => {
    let itemList = [];
    organizations.map((org) => {
      org.donation_requests.map(dr => {
        itemList = [...itemList, ...(dr.items.map(({ name, amount }) => name) || [])]
      })
    })
    return [...new Set(itemList)]
  }
  const handleFilter = () => {
    const result = organizations.map(org => {
      return {
        ...org,
        donation_requests: (org.donation_requests || []).map(dr => {
          return {
            ...dr,
            items: (dr.items || []).filter(({ name, amount }) => !item || (item && name == item))
          }
        })
      }
    })
      .map(org => {
        return {
          ...org,
          donation_requests: (org.donation_requests || []).filter(dr => (dr.items || []).length != 0)
        }
      })
      .filter(org => !(check && (org.donation_requests || []).length == 0))
    setLocations(getLocations(result))
  }
  useEffect(() => {
    getOrganizations()
  }, []);
  useEffect(() => {
    setItems(getItems());
    setLocations(getLocations());
    setCustomeAmount(initCustomeAmount())
  }, [organizations]);
  useEffect(() => {
    handleFilter()
  }, [item, check, customeAmount]);
  return (
    <div style={{ position: 'relative' }}>
      <Map locations={locations} isDisplayRoute={Boolean(generate)} />
      <div style={{ position: 'absolute', right: '20%', bottom: '10%' }}>
        <Button style={{ background: 'blue', color: 'white' }} onClick={handleFilterOpen}>Filter</Button>
        <Menu
          anchorEl={anchorEl}
          open={filterOpen}
          onClose={handleFilterClose}
          style={{
            transform: "translateY(-12%)"
          }}
        >
          <MenuItem><Checkbox checked={check} onClick={() => setcheck(!check)} />have donation request</MenuItem>
          <MenuItem>
            <FormControl fullWidth>
              <InputLabel id="item-select-label">Items</InputLabel>
              <Select
                labelId="item-select-label"
                id="item-select"
                value={item}
                label="Item"
                onChange={(event) => setItem(event.target.value)}
              >
                <MenuItem value={""}>All Items</MenuItem>
                {Array.isArray(items) && items.map(its => <MenuItem value={its}>{its}</MenuItem>)}
              </Select>
            </FormControl>
          </MenuItem>
        </Menu>
      </div>
      <Dialog
        open={deliveryOpen}
        onClose={() => setDeliveryOpen(false)}
        PaperProps={{
          component: "form",
          onSubmit: createDelivery,
        }}
      >
        <DialogTitle> Do you want a delivery ?</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker
                label="DateTime picker"
                value={deliveryDate}
                onChange={(newDate) => { setDeliveryDate(dayjs.tz(newDate, 'America/New_York')) }}
                format="MM/DD/YYYY hh:mm A"
              />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeliveryOpen(false)}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DonatorHome;

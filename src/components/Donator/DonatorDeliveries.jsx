import * as React from "react";
import routes from "../../router";
import { useSelector, useDispatch } from "react-redux";
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MyTable from "../MyTable";
import DeliveryService from "../../../services/DeliveryService";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { socket } from "../../../socket";
import UserService from "../../../services/UserService";
import { setUser } from "../../../redux/actions/user";
dayjs.extend(utc);
dayjs.extend(timezone);

function DonatorDeliveries() {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [editDelivery, setEditDelivery] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState(false);
  const [date, setDate] = React.useState(dayjs("2022-04-17"));
  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    const fetchData = async () => {
      const resultPromise = user.delivery_requests.map(async (delivery) => {
        const data = await DeliveryService.getDeliverieById(delivery);
        return data;
      });
      const result = await Promise.all(resultPromise);
      setTableData(result.filter((item) => item));
    };
    fetchData();
  }, []);
  const deleteDelivery = async (id) => {
    const result = await DeliveryService.deleteDelivery(id);
    if (result) {
      socket.emit("deleteDelivery", result);
      const updateDalivery = await UserService.updateUser({
        ...user,
        delivery_requests: (user.delivery_requests || []).filter(
          (dr) => dr != id
        ),
      });
      dispatch(
        setUser({
          ...user,
          delivery_requests: (user.delivery_requests || []).filter(
            (dr) => dr != id
          ),
        })
      );
    }
  };
  const saveDelivery = async (event) => {
    event.preventDefault();
    const result = await DeliveryService.updateDelivery({
      ...editDelivery,
      delivery_date: date.format("YYYY-MM-DDTHH:MM:00.00"),
    });
    if (result) {
      setTableData(
        tableData.map((data) => {
          if (editDelivery._id == data._id) return result;
          return data;
        })
      );
      setDeliveryForm(false);
      setEditDelivery(null);
    }
  };
  const columns = [
    { id: "id", label: "ID", accessor: (row) => row._id },
    { id: "donator", label: "Donator", accessor: (row) => row.donator.name },
    {
      id: "organization",
      label: "Organization",
      accessor: (row) => row.organization.name,
    },
    {
      id: "delivery_date",
      label: "Delivery Date",
      accessor: (row) => row.delivery_date,
    },
    { id: "status", label: "Status", accessor: (row) => row.status },
    {
      id: "actions",
      label: "Actions",
      accessor: (row) => {
        return (
          <>
            <Button
              onClick={() => {
                setEditDelivery(row);
                setDate(dayjs.tz(row.delivery_date, "America/New_York"));
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
        );
      },
    },
  ];
  return (
    <PersistentDrawerLeft
      headerText="GiveHub"
      drawList={routes.filter(
        (item) => (
          user && "name", "icon" in item && item.auth.includes(user.__t)
        )
      )}
    >
      <Box sx={{ width: "100%" }}>
        <MyTable columns={columns} tableData={tableData} />
        <Dialog
          open={deliveryForm}
          onClose={() => setDeliveryForm(false)}
          PaperProps={{
            component: "form",
            onSubmit: saveDelivery,
          }}
        >
          <DialogTitle>Edit delivery request</DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                  label="DateTime picker"
                  value={date}
                  onChange={(newDate) => {
                    setDate(dayjs.tz(newDate, "America/New_York"));
                  }}
                  format="MM/DD/YYYY hh:mm A"
                />
              </DemoContainer>
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeliveryForm(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PersistentDrawerLeft>
  );
}

export default DonatorDeliveries;

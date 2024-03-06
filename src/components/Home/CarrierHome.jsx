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
import { addRoute, deleteRoute } from "../../../redux/actions/routes";
import { socket } from "../../../socket";

function CarrierHome() {
  const routes = useSelector((state) => state.routes.routes);
  const user = useSelector((state) => state.user.user);
  const [locations, setLocations] = useState([]);
  const [donators, setDonators] = useState([]);
  const dispatch = useDispatch();

  const updateDalivery = async (delivery) => {
    await DeliveryService.updateDelivery({ ...delivery, status: "Accepted" });
    const carrier = {
      ...user,
      accepted_deliveries: [...user.accepted_deliveries, delivery._id],
    };
    await UserService.updateUser(carrier);
    dispatch(setUser(carrier));
    dispatch(
      addRoute({
        lat: delivery.donator.address.latitude,
        lng: delivery.donator.address.longitude,
      })
    );
    dispatch(
      addRoute({
        lat: delivery.organization.location.latitude,
        lng: delivery.organization.location.longitude,
      })
    );
    await getDonators();
  };
  let { generate } = useParams();
  socket.on("notification", (delivery) => {
    console.log("notification", delivery);
    dispatch(
      deleteRoute({
        lat: delivery.donator.address.latitude,
        lng: delivery.donator.address.longitude,
      })
    );
    dispatch(
      deleteRoute({
        lat: delivery.organization.location.latitude,
        lng: delivery.organization.location.longitude,
      })
    );
    forceUpdate();
  });
  console.log("generate", generate);
  const getDonators = async () => {
    const Donatorresult = await UserService.getAllDonators();
    const donatorList = (
      Array.isArray(Donatorresult) ? Donatorresult : []
    ).filter(
      (filter) => "address" in filter && filter.delivery_requests.length != 0
    );
    const donatorPromise = donatorList.map(async (donator) => {
      const resultPromise = donator.delivery_requests.map(async (dr) => {
        const data = await DeliveryService.getDeliverieById(dr);
        return data;
      });
      const result = await Promise.all(resultPromise);
      return {
        ...donator,
        delivery_requests: result,
      };
    });
    setDonators(
      (await Promise.all(donatorPromise)).filter(
        (d) => d.delivery_requests.length != 0
      )
    );
  };
  const getLocations = () => {
    if (!Boolean(generate))
      return (Array.isArray(donators) ? donators : []).map((donator) => {
        return {
          location: {
            lat: donator.address.latitude,
            lng: donator.address.longitude,
          },
          element: (
            <>
              {(donator.delivery_requests || [])
                .filter((item) => item)
                .map(
                  (dr) =>
                    dr.status == "Pending" && (
                      <>
                        {dayjs
                          .tz(dr.delivery_date, "America/New_York")
                          .format("YYYY-MM-DD HH:MM")}
                        <Button onClick={async () => await updateDalivery(dr)}>
                          Accept
                        </Button>
                      </>
                    )
                )}
            </>
          ),
        };
      });
    else
      return routes.map((route) => {
        return { location: route };
      });
  };
  useEffect(() => {
    getDonators();
  }, []);
  useEffect(() => {
    setLocations(getLocations());
  }, [donators]);
  return <Map locations={locations} isDisplayRoute={Boolean(generate)} />;
}

export default CarrierHome;
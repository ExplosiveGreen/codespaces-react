import routes from "../../router";
import { useDispatch, useSelector } from "react-redux";
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import MyTable from "../MyTable";
import DeliveryService from "../../../services/DeliveryService";
import DonationService from "../../../services/DonationService";
import UserService from "../../../services/UserService";
import { setUser } from "../../../redux/actions/user";

function OrgDeliveries() {
  const [tableData, setTableData] = useState([]);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const resultPromise = user.deliveries.map(async (delivery) => {
        const data = await DeliveryService.getDeliverieById(delivery);
        return data;
      });
      const result = await Promise.all(resultPromise);
      setTableData(result.filter((item) => item));
    };
    fetchData();
  }, [user]);
  const ApproveDelivery = async (delivery) => {
    const result = DeliveryService.updateDelivery({
      ...delivery,
      status: "Complete",
    });
    if (result) {
      setTableData(
        tableData.map((data) => {
          if (data._id == delivery._id) return result;
          return data;
        })
      );
      const resultPromise = (
        typeof delivery.donations == "object"
          ? [delivery.donations]
          : delivery.donations
      ).map(async (donation) => {
        const updateDonation = await DonationService.updateDonationRequest({
          ...donation,
          status: "Complete",
        });
        return updateDonation._id;
      });
      const Donationsids = await Promise.all(resultPromise);
      const userOrg = {
        ...user,
        donations: [...user.donations.map((dd) => dd._id), Donationsids],
      };
      const updateOrg = await UserService.updateUser(userOrg);
      if (updateOrg) dispatch(setUser(userOrg));
    }
  };
  const columns = [
    { id: "id", label: "ID", accessor: (row) => row._id },
    {
      id: "delivery_date",
      label: "Delivery Date",
      accessor: (row) => row.delivery_date,
    },
    { id: "donator", label: "Donator", accessor: (row) => row.donator?.name },
    {
      id: "organization",
      label: "Organization",
      accessor: (row) => row.organization?.name,
    },
    { id: "status", label: "Status", accessor: (row) => row.status },
    {
      id: "actions",
      label: "Actions",
      accessor: (row) => {
        if (row.status == "Awaiting")
          return (
            <Button onClick={async () => await ApproveDelivery(row)}>
              Approve
            </Button>
          );
        return <></>;
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
      </Box>
    </PersistentDrawerLeft>
  );
}

export default OrgDeliveries;

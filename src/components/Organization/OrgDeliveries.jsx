import routes from '../../router';
import { useSelector } from 'react-redux';
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import MyTable from '../MyTable';
import DeliveryService from '../../../services/DeliveryService';


function OrgDeliveries() {
    const [tableData, setTableData] = useState([])
    const user = useSelector((state) => state.user.user)
    useEffect(() => {
      const fetchData = async() => {
      const resultPromise = user.deliveries.map(async(delivery) => {
        const data = await DeliveryService.getDeliverieById(delivery);
        return data;
      })
      const result = await Promise.all(resultPromise)
      setTableData(result)
    }
    fetchData()
    }, []);
    const ApproveDelivery = async (id) => {
      console.log(id)
    }
    const columns = [
        { id: 'id', label: 'ID', accessor: (row) => row._id },
        { id: 'delivery_date', label: 'Delivery Date', accessor: (row) => row.delivery_date },
        { id: 'donator', label: 'Donator', accessor: (row) => row.donator?.name },
        { id: 'organization', label: 'Organization', accessor: (row) => row.organization?.name },
        { id: 'status', label: 'Status', accessor: (row) => row.status },
        { id: 'actions', label: 'Actions', accessor: (row) => {
          if(row.status == "Awaiting") return <Button onClick={async ()=> await ApproveDelivery(row._id)}>Approve</Button>
          return (<></>) 
        }}
    ];
    return (
        <PersistentDrawerLeft
            headerText ='GiveHub'
            drawList = {routes.filter(item => (user && 'name','icon' in item && item.auth.includes(user.__t)))}
        >
          <Box sx={{ width: '100%' }}>
            <MyTable columns={columns} tableData={tableData} />
          </Box>
        </PersistentDrawerLeft>
    )
  }
  
  export default OrgDeliveries;
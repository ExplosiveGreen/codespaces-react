import routes from '../../router';
import { useSelector } from 'react-redux';
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import MyTable from '../MyTable';
import DeliveryService from '../../../services/DeliveryService';


function DonatorDeliveries() {
    const [tableData, setTableData] = useState([])
    const user = useSelector((state) => state.user.user)
    useEffect(() => {
        const fetchData = async () => {
          const data = await DeliveryService.getDonatorDeliveries(user);
          setTableData(data);
        };
    
        fetchData();
      }, []);
    const columns = [
        { id: 'id', label: 'ID', accessor: (row) => row.Id },
        { id: 'donator', label: 'Donator', accessor: (row) => row.Donator.name },
        { id: 'organization', label: 'Organization', accessor: (row) => row.Organization.name },
        { id: 'delivery_date', label: 'Delivery Date', accessor: (row) => row.Delivery_date },
        { id: 'status', label: 'Status', accessor: (row) => row.status },
    ];
    return (
        <PersistentDrawerLeft 
            headerText ='GiveHub'
            drawList = {routes.filter(item => (user && 'name','icon' in item && item.auth.some(item2 => user.auth.includes(item2))))}
        >
          <Box sx={{ width: '100%' }}>
            <MyTable columns={columns} tableData={tableData} />
          </Box>
        </PersistentDrawerLeft>
    )
  }
  
  export default DonatorDeliveries;
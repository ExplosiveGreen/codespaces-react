import routes from '../../router';
import { useSelector } from 'react-redux';
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import DonationService from '../../../services/DonationService';
import MyTable from '../MyTable';


function DonatorDonations() {
    const [tableData, setTableData] = useState([])
    const user = useSelector((state) => state.user.user)
    useEffect(() => {
        const fetchData = async () => {
          const data = await DonationService.getDonatorDonations(user);
          setTableData(data);
        };
    
        fetchData();
      }, []);
    const columns = [
        { id: 'id', label: 'ID', accessor: (row) => row.Id },
        { id: 'items', label: 'items', accessor: (row) =>
         <List> 
            {row.items.map(({name,amount}) =>(
                <ListItem>
                    <ListItemText primary={`${name} : ${amount}`} />
                </ListItem>
            ))}
         </List> 
        },
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
  
  export default DonatorDonations;
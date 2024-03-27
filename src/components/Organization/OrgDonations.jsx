import routes from '../../router';
import { useSelector } from 'react-redux';
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import MyTable from '../MyTable';


function OrgDonations() {
    const [tableData, setTableData] = useState([])
    const user = useSelector((state) => state.user.user)
    useEffect(() => {
        setTableData(user.donations);
      }, []);
    const columns = [
        { id: 'id', label: 'ID', accessor: (row) => row._id },
        { id: 'items', label: 'items', accessor: (row) =>
         <List> 
            {row.items.map(({name,amount},index) =>(
                <ListItem key={`${row._id}-item-${index}`}>
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
            drawList = {routes.filter(item => (user && 'name','icon' in item && item.auth.includes(user.__t)))}
        >
          <Box sx={{ width: '100%' }}>
            <MyTable columns={columns} tableData={tableData} />
          </Box>
        </PersistentDrawerLeft>
    )
  }
  
  export default OrgDonations;
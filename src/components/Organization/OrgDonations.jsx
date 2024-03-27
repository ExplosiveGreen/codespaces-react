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
        { field: "_id", headerName: "ID", flex:1 },
        { field: 'items', headerName: 'items',flex:1, renderCell: ({row}) =>
         <List> 
            {row.items.map(({name,amount},index) =>(
                <ListItem key={`${row._id}-item-${index}`}>
                    <ListItemText primary={`${name} : ${amount}`} />
                </ListItem>
            ))}
         </List> 
        },
        { field: 'status', headerName: 'Status',flex:1 },
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
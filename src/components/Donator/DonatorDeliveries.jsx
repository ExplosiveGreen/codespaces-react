import routes from '../../router';
import { useSelector } from 'react-redux';
import PersistentDrawerLeft from "../PersistentDrawerLeft";
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import MyTable from '../MyTable';


function DonatorDeliveries() {
    const [tableData, setTableData] = useState([])
    const user = useSelector((state) => state.user.user)
    const getDeliveries = async () => {
        return [
            {Id:1,
            Donator:{name:'hfghf'},
            Organization:{name:'hfghfghfg'},
            Delivery_date:Date('12.2.2024'),
            status:'finished',
            donation:{
                items:[{name:'shirts', amount:50},{name:'shoes', amount:50}],
                status:'finished'
            }},
            {Id:2,
                Donator:{name:'hfghf'},
                Organization:{name:'hfghfghfg'},
                Delivery_date:Date('13.2.2024'),
                status:'finished',
                donation:{
                    items:[{name:'shirts', amount:50},{name:'shoes', amount:50}],
                    status:'finished'
            }}
        ];
    }
    useEffect(() => {
        const fetchData = async () => {
          const data = await getDeliveries();
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
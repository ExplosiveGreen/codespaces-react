import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
const MyTable = ({ columns, tableData }) => {
  console.log(columns)
  return (<>
    {Array.isArray(columns) && Array.isArray(tableData) && (
        <DataGrid
          rows={tableData.map((item, index) => { return { ...item, id: item._id || `${index}` } })}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      )
    }
  </>);
};

export default MyTable;
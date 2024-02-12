import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

const MyTable = ({ columns, tableData }) => {
  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.id} align={column.align}>
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableData.map((row) => (
          <TableRow key={row[0]}>
            {columns.map((column) => (
              <TableCell key={column.id}>{column.accessor(row)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MyTable;
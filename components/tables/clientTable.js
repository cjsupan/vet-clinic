import { useTable } from 'react-table';
import {useMemo} from 'react';
import {Button} from 'antd';
function ClientTable({allClients}){

  const COLUMNS = [
    {
      Header: 'First name',
      accessor: 'Firstname',
      show: true
    },
    {
      Header: 'Last name',
      accessor: 'Lastname',
      show: true
    },
    {
      Header: 'Email Address',
      accessor: 'Email',
      show: true
    },
    {
      Header: 'Contact No.',
      accessor: 'Contact',
      show: true
    },
    {
      Header: 'Address',
      accessor: 'Address',
      show: true
    },
  ];


const columns = useMemo(() => COLUMNS, []);
const data = useMemo(() => allClients, []);

const viewClient = (hooks) => {
  hooks.visibleColumns.push((columns) => [...columns, {
    Header: 'Action',
    accessor: 'Action',
    Cell: ({row}) => (
      <div className='flex flex-row justify-center space-x-4'>
      <Button type='primary' onClick={()=> console.log(row.original._id)}>View</Button>
      <Button type='primary' onClick={()=> console.log(row.original._id)} danger>Deactivate</Button>
      </div>
      
    )
  }])
}

const {
  getTableProps,
  getTableBodyProps, 
  headerGroups, 
  rows, 
  prepareRow
} = useTable({
  columns,
  data,
}, viewClient);
    return(
      <div style={{height: '80vh'}} className='w-full border-b border-l border-r border-grey-200 '>
        <table className='w-full' {...getTableProps()}>
          <thead className='h-10 bg-secondary'>
            {headerGroups.map((headerGroup)=> (
              <tr className='border border-grey' {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th className='text-white border-2' {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)

              return (
                <tr className='h-10' {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td className='border text-center capitalize' {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )})}
          </tbody>
        </table>
      </div>
    )
}

export default ClientTable;
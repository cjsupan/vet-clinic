import axios from 'axios';
import { mutate } from 'swr';
import {Button} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const clientActionsButton = (hooks) => {
  const router = useRouter()
  const updateStatus = async (id, value) => {
    await axios.patch(`http://localhost:3000/api/clients/${id}`, {Status: !value}, { headers: { 'Content-type': 'application/json' }}).then(res => res.data);
    mutate('http://localhost:3000/api/clients');
  }

    hooks.visibleColumns.push((columns) => [...columns, {
      Header: 'Action',
      accessor: 'Action',
      Cell: ({row}) => (
        <div className='flex flex-row justify-center space-x-4'>
        <Button type='primary'><Link href={{pathname: 'clientProfile', query: {_id: row.original._id}}}>View</Link></Button>
  
        {
          row.original.Status === true ? 
            <Button type='primary' onClick={()=> updateStatus(row.original._id, row.original.Status)} danger>Deactivate</Button>
          :
            <Button type='primary' onClick={()=> updateStatus(row.original._id, row.original.Status)} style={{width: '95px'}}>Activate</Button>
        }
        
        </div>
        
      )
    }])
}

export default clientActionsButton;
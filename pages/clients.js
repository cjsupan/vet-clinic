import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import useSWR from 'swr';
import {Button, Modal} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import ClientTable from '../components/tables/clientTable';
import { PlusCircle, X } from 'react-feather';
import TextField from '../components/form/textField';
import * as yup from 'yup';


// Modal.setAppElement('body');
const fetcher = (...args) => fetch(...args).then((res) => res.json());
const Clients = ({allClients})=> {
  const { data, error, mutate, isValidating} = useSWR(`http://localhost:3000/api/clients`, fetcher, {initialValues: allClients, revalidateOnFocus: false});
  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const onSubmit = async values =>{
    setFormLoading(true);

  await fetcher('http://localhost:3000/api/clients', {
      method: 'POST',
      body: JSON.stringify(values)
    });
    mutate();
    setFormLoading(false);
    setModalOpen(false);
   
  }

  const validationSchema = () => yup.object({ 
    Firstname: yup.string().required('First name is a required field'),
    Lastname: yup.string().required('Last name is a required field'),
    Email: yup.string().required('Email is a required field').email(),
    Contact: yup.string().required('Contact number is a required field'),
    Address: yup.string().required('Name is a required field'),
  });

  const {errors, values, handleChange, handleSubmit, handleBlur} = useFormik({
		enableReinitialize: true,
		initialValues: {Firstname: '', Lastname: '', Email: '', Contact: '', Address: '',},
		validationSchema,
    onSubmit
  });

  const openModal = () => {
    setModalOpen(true);
  }
  // console.log('data', data);
  const closeModal = () => {
    setModalOpen(false);
  }
  if(isValidating || !data) return <Spin indicator={<LoadingOutlined spin/> }/>
  if(error) return <div>Error</div>
 
  return (
      <>
        <Head><title>Clients Page</title></Head>
        <div className='flex flex-col space-y-4'>
        <button onClick={openModal} className='flex flex-row border-2 space-x-2 self-end px-2 py-1 rounded-lg shadow-md bg-primary'><PlusCircle color='white'/><span className='text-white'> Add Client</span></button>

       <ClientTable allClients={data.data} />
        </div>
          <Modal 
          title="Add Client"
          centered
          open={modalOpen}
          onOk={closeModal}
          onCancel={closeModal}
          maskClosable={false}
          width={500}
          footer={[
            <Button type='primary' key='submit' onClick={handleSubmit} style={{borderRadius: '5px'}}>Submit</Button>
          ]}>
            <form onSubmit={handleSubmit} className='flex flex-col w-full space-y-2 px-10'>
              <TextField label='First name: '
                id='Firstname' 
                placeholder='Firstname' 
                name='Firstname' 
                type='text' 
                onChange={handleChange}
                onBlur={handleBlur} 
                value={values.Firstname}
                error={errors.Firstname}/>
              <TextField 
                label='Last name: '
                id='Lastname' 
                placeholder='Lastname' 
                name='Lastname' 
                type='text' 
                onChange={handleChange}
                onBlur={handleBlur}  
                value={values.Lastname}
                error={errors.Lastname}/>
              <TextField 
                label='Email: ' 
                id='Email' 
                placeholder='Email' 
                name='Email' 
                type='email' 
                onChange={handleChange} 
                onBlur={handleBlur} 
                value={values.Email}
                error={errors.Email}/>
              <TextField 
                label='Contact no: ' 
                id='Contact' 
                placeholder='Contact No.' 
                name='Contact' 
                type='text' 
                onChange={handleChange} 
                onBlur={handleBlur} 
                value={values.Contact}
                error={errors.Contact}/>
              <TextField 
                label='Address: ' 
                id='Address' 
                placeholder='Address' 
                name='Address' 
                type='text' 
                onChange={handleChange} 
                onBlur={handleBlur} 
                value={values.Address}
                error={errors.Address}/>
            </form>
          </Modal>
      </>
  )
}

export async function getStaticProps(context) {
  let res = await fetch("http://localhost:3000/api/clients", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let { data } = await res.json();
  return {props: { allClients: data}}
}

export default Clients;
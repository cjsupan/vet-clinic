import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Spin, Button } from 'antd';
import moment from 'moment';

import { PlusCircle } from 'react-feather';
import { LoadingOutlined } from '@ant-design/icons';
import AddPet from '../../components/modals/addPet';

import dynamic from 'next/dynamic';

const PetRecordTable = dynamic(() => import('../../components/tables/petRecordsTable'))

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const PetProfile = ({petData}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const {
    register,
    setValue,
    handleSubmit,
    resetField,
    formState: {errors}} = useForm({
      defaultValues: {
        PetId: petData._id,
        Date: '',
        Name: '',
        Species: '',
        Sex: '',
        Birthdate: '',
        Breed: '',
        Altered: '',
        Color: '',
        }
    });

    const onSubmit = async (values) => {
      values.Date = moment(values.Date).format('YYYY-MM-DD')
      await fetcher('http://localhost:3000/api/pets', {
          method: 'POST',
          body: JSON.stringify(values)
        });
      
      mutate('http://localhost:3000/api/pets');
      resetField();
      closeModal();
     
    }

  const openModal = () => {
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  }
  if(!petData)
  return <Spin indicator={<LoadingOutlined spin/> }/>
  return (
    <>
      <Head><title>Pet Profile</title></Head>
      <div className='flex flex-row w-full h-full'>
        <div className=' flex flex-col w-2/5 h-full '>
          <div className='flex flex-col border justify-around rounded-lg h-2/5 shadow-lg p-5 bg-gray-100'>
            <h1 className='w-full border-b text-lg font-medium'>Pet Profile</h1>
            <p className='text-sm'>Name: <span className='text-base font-medium capitalize'>{petData.Name}</span></p>
            <p className='text-sm'>Species: <span className='text-base font-medium '>{petData.Species}</span></p>
            <p className='text-sm'>Breed: <span className='text-base font-medium capitalize'>{petData.Breed}</span></p>
            <p className='text-sm'>Sex: <span className='text-base font-medium '>{petData.Sex}</span></p>
            <p className='text-sm'>Altered: <span className='text-base font-medium capitalize'>{petData.Altered}</span></p>
            <p className='text-sm'>Birthdate: <span className='text-base font-medium capitalize'>{petData.Birthdate}</span></p>
            <p className='text-sm'>Color: <span className='text-base font-medium capitalize'>{petData.Color}</span></p>
          </div>
          <div className='border rounded-lg h-full mt-2 shadow-lg p-1 bg-gray-100'>
          </div>
        </div>
        <div className='flex flex-col border-2 w-full h-full rounded-lg shadow-lg p-5 ml-2 bg-gray-100'>
          <h1 className='w-full border-b text-lg font-medium'>Pet Records</h1>
          <div className='flex flex-col h-full justify-around'>
            <Button type="primary" onClick={openModal} className='w-40 self-end mb-10' icon={<PlusCircle className='inline-flex mr-2 mb-1'/>}><span className='font-medium text-base '>Add Record</span></Button>
            <PetRecordTable id={petData._id}/>
           
          </div>
        </div>
      </div>
      {/* <AddPet 
        clientId={clientData._id}
        closeModal={closeModal}
        modalOpen={modalOpen}
        handleSubmit={handleSubmit}
        register={register}
        setValue={setValue}
        resetField={resetField}
        errors={errors}
        onSubmit={onSubmit}
        /> */}
    </>
  )
}

export async function getServerSideProps(context){
  const petData = await axios.get(`http://localhost:3000/api/pets/${context.query._id}`).then(res => res.data.data);
  return {
    props: {petData: petData[0]}, // will be passed to the page component as props
  }
}

export default PetProfile;
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Spin, Button } from "antd";
import moment from "moment";

import { PlusCircle } from "react-feather";
import { LoadingOutlined } from "@ant-design/icons";

import dynamic from "next/dynamic";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const ClientProfile = ({ clientData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    setValue,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ClientId: clientData._id,
      Date: "",
      Name: "",
      Species: "",
      Sex: "",
      Birthdate: "",
      Breed: "",
      Altered: "",
      Color: "",
    },
  });

  const onSubmit = async (values) => {
    values.Date = moment(values.Date).format("YYYY-MM-DD");
    await fetcher("http://localhost:3000/api/pets", {
      method: "POST",
      body: JSON.stringify(values),
    });

    mutate("http://localhost:3000/api/pets");
    resetField();
    closeModal();
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  if (!clientData) return <Spin indicator={<LoadingOutlined spin />} />;
  return (
    <>
      <Head>
        <title>Client Profile</title>
      </Head>
      <div className="flex flex-row w-full h-full">
        <div className=" flex flex-col w-2/5 h-full ">
          <div className="flex flex-col border justify-around rounded-lg h-2/5 shadow-lg p-5 bg-gray-100">
            <h1 className="w-full border-b text-lg font-medium">
              Client&apos;s Details
            </h1>
            <p className="text-sm">
              Name:{" "}
              <span className="text-base font-medium capitalize">
                {clientData.Firstname} {clientData.Lastname}
              </span>
            </p>
            <p className="text-sm">
              Email:{" "}
              <span className="text-base font-medium ">{clientData.Email}</span>
            </p>
            <p className="text-sm">
              Address:{" "}
              <span className="text-base font-medium capitalize">
                {clientData.Address}
              </span>
            </p>
            <p className="text-sm">
              Contact No:{" "}
              <span className="text-base font-medium ">
                {clientData.Contact}
              </span>
            </p>
          </div>
          <div className="border rounded-lg h-full mt-2 shadow-lg p-1 bg-gray-100"></div>
        </div>
        <div className="flex flex-col border-2 w-full h-full rounded-lg shadow-lg p-5 ml-2 bg-gray-100">
          <h1 className="w-full border-b text-lg font-medium">Pet Lists</h1>
          <div className="flex flex-col h-full justify-around">
            <Button
              type="primary"
              onClick={openModal}
              className="w-32 self-end"
              icon={<PlusCircle className="inline-flex mr-2" />}
            >
              <span className="font-medium text-base">Add Pet</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const clientData = await axios
    .get(`http://localhost:3000/api/clients/${context.query._id}`)
    .then((res) => res.data.data);

  return {
    props: { clientData: clientData[0] }, // will be passed to the page component as props
  };
}

export default ClientProfile;

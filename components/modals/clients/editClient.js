import { useEffect, useState } from "react";
import { Modal, Form, message } from "antd";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { isEqual, set, sortBy } from "lodash";
import { Input, Space, Text, Button, Switch, ScrollArea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import {
  toggle as toggleClient,
  update as updatedClient,
  fetch as fetchClients,
} from "../../../store/slices/clientSlice";
import { EyeOff, Eye, Check, X } from "react-feather";
import { bool } from "yup";

const EditClientModal = () => {
  const dispatch = useDispatch();
  const {
    data: clients,
    selectedClient,
    modalEdit,
  } = useSelector((state) => state.client, isEqual);

  const defaultValues = {
    Firstname: "",
    Lastname: "",
    Email: "",
    Address: "",
    Contact: "",
    Active: "",
  };
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(
        updatedClient({ Id: selectedClient._id, data })
      );

      dispatch(fetchClients());
      close();
      notifications.show({
        title: "Success",
        message: res.message,
        icon: <Check />,
        color: "teal",
      });
    } catch (err) {
      console.log(err);
      notifications.show({
        title: "Error",
        message: err.message,
        color: "red",
        icon: <X />,
      });
    }
  };

  const close = () => {
    reset();
    dispatch(toggleClient({ modalAdd: false }));
  };

  const validateContact = (value) => {
    if (!value.startsWith("9")) {
      return "Contact number should start with '9'";
    }

    if (value.length !== 10) {
      return "Contact number should be 10 digits";
    }
    return true;
  };

  const validateEmail = (val) => {
    if (val) {
      if (
        !val.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/)
      ) {
        return "Invalid email address";
      }

      return true;
    }
  };

  useEffect(() => {
    setValue("Firstname", selectedClient.Firstname);
    setValue("Lastname", selectedClient.Lastname);
    setValue("Email", selectedClient.Email);
    setValue("Address", selectedClient.Address);
    setValue("Contact", selectedClient.Contact);
    setValue("Active", selectedClient.Active);
  }, [selectedClient, setValue]);

  useEffect(() => {
    dispatch(fetchClients());
  }, [modalEdit, dispatch]);

  const fields = ({ label, errors, register }) => {
    if (label === "Contact Number") {
      return (
        <>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <Input
            icon={"+63"}
            placeholder={label}
            type={label === "Contact Number" && "number"}
            size="sm"
            multiline={false}
            radius={"md"}
            {...register}
            error={errors}
          />
          {errors && (
            <Text fz="sm" color="red">
              {errors}
            </Text>
          )}
          <Space h="lg" />
        </>
      );
    }

    if (label === "Active") {
      return (
        <>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <Switch
            onLabel="Yes"
            offLabel="No"
            size="md"
            defaultChecked={getValues("Active")}
            {...register}
          />
          <Space h="lg" />
        </>
      );
    }

    return (
      <>
        <Text fz="md" fw="400">
          {label}
        </Text>
        <Input
          placeholder={label}
          size="sm"
          multiline={false}
          radius={"md"}
          {...register}
          error={errors}
        />

        {errors && (
          <Text fz="sm" color="red">
            {errors}
          </Text>
        )}
        <Space h="lg" />
      </>
    );
  };

  return (
    <>
      <Modal
        title="Edit Client"
        open={modalEdit}
        destroyOnClose
        maskClosable={false}
        onCancel={close}
        footer={null}
        width={600}
        centered
      >
        <Form onFinish={handleSubmit(onSubmit)}>
          <div
            style={{
              height: "70vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <ScrollArea style={{ height: "75vh", padding: "0px 20px" }}>
              {fields({
                label: "First Name",
                register: {
                  ...register("Firstname", {
                    required: "Firstname is a required field",
                  }),
                },
                errors: errors.Firstname?.message,
              })}
              {fields({
                label: "Last Name",
                register: {
                  ...register("Lastname", {
                    required: "Lastname is a required field",
                  }),
                },
                errors: errors.Lastname?.message,
              })}
              {fields({
                label: "Email",
                register: {
                  ...register("Email", {
                    required: "Email is a required field",
                    validate: (val) => validateEmail(val),
                  }),
                },
                errors: errors.Email?.message,
              })}
              {fields({
                label: "Address",
                register: {
                  ...register("Address", {
                    required: "Address is a required field",
                  }),
                },
                errors: errors.Address?.message,
              })}
              {fields({
                label: "Contact Number",
                register: {
                  ...register("Contact", {
                    required: "Contact number is a required field",
                    validate: (val) => validateContact(val),
                  }),
                },
                errors: errors.Contact?.message,
              })}
              {fields({
                label: "Active",
                register: {
                  ...register("Active"),
                },

                errors: errors.Active?.message,
              })}
            </ScrollArea>
            <Button type="submit" style={{ alignSelf: "end" }}>
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default EditClientModal;

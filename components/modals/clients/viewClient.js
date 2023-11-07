import { useState } from "react";
import { Modal, Form, message } from "antd";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { isEqual, sortBy } from "lodash";
import { Input, Space, Text, Button, Switch, ScrollArea } from "@mantine/core";
import moment from "moment";
import { toggle as toggleClient } from "../../../store/slices/clientSlice";
import {
  toggle as toggleAppointments,
  setClient,
} from "../../../store/slices/appointmentSlice";
import AddAppointmentModal from "../appointments/addAppointment";

const ViewClientModal = () => {
  const dispatch = useDispatch();
  const { modalView, selectedClient } = useSelector(
    (state) => state.client,
    isEqual
  );

  const close = () => {
    dispatch(toggleClient({ modalView: false }));
  };

  const fields = ({ label, value, errors, register }) => {
    return (
      <>
        <Text fz="md" fw="400">
          {label}
        </Text>

        <Input
          size="sm"
          multiline={false}
          radius={"md"}
          value={value}
          readOnly
          styles={(theme) => ({
            input: {
              "&:focus-within": {
                borderColor: theme.colors.gray[4],
              },
            },
          })}
        />
        <Space h="md" />
      </>
    );
  };

  return (
    <>
      <Modal
        title="Client's Information"
        open={modalView}
        onCancel={close}
        footer={null}
        width={600}
        centered
        keyboard={false}
        maskClosable={false}
        destroyOnClose
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "70vh",
          }}
        >
          <Button
            style={{ alignSelf: "end" }}
            onClick={() => {
              dispatch(toggleAppointments({ modalAdd: true }));
              dispatch(setClient(selectedClient.id));
            }}
          >
            Add Appointment
          </Button>
          <ScrollArea style={{ height: "80vh", padding: "10px 20px" }}>
            {fields({ label: "Firstname", value: selectedClient.firstname })}
            {fields({ label: "Lastname", value: selectedClient.lastname })}
            {fields({ label: "Email", value: selectedClient.email })}
            {fields({ label: "Address", value: selectedClient.address })}
            {fields({ label: "Contact Number", value: selectedClient.contact })}
            {fields({
              label: "Status",
              value: selectedClient.status ? "Active" : "Not Active",
            })}
          </ScrollArea>
        </div>
      </Modal>
      <AddAppointmentModal />
    </>
  );
};

export default ViewClientModal;

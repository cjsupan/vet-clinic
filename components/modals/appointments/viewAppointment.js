import { useEffect, useState } from "react";
import { Modal, DatePicker, TimePicker } from "antd";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { isEqual } from "lodash";
import { Input, Space, Text, Button, Switch } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Check, X } from "react-feather";
import moment from "moment";

import {
  toggle as toggleAppointments,
  update as updateAppointment,
  deleted as deleteAppointment,
  setSelected,
} from "../../../store/slices/appointmentSlice";
import EditAppointmentModal from "./editAppointment";

const ViewAppointmentModal = () => {
  const dispatch = useDispatch();
  const [appointment, setAppointment] = useState({});

  const { selectedAppointment: selectedAppointment, modalView } = useSelector(
    (state) => state.appointment,
    isEqual
  );

  const close = () => {
    dispatch(toggleAppointments({ modalView: false }));
  };

  useEffect(() => {
    setAppointment(selectedAppointment);
  }, [modalView]);

  const info = ({ label, value }) => {
    if (label === "Date") {
      return (
        <div style={{ cursor: "pointer" }}>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <Input
            size="sm"
            multiline={false}
            radius={"md"}
            value={moment(value).format("YYYY-MM-DD")}
            readOnly
            styles={(theme) => ({
              input: {
                "&:focus-within": {
                  borderColor: theme.colors.gray[4],
                },
                cursor: "default",
              },
            })}
          />
          <Space h="md" />
        </div>
      );
    }

    if (label === "Time") {
      return (
        <>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <Input
            size="sm"
            multiline={false}
            radius={"md"}
            value={moment(value).format("hh:mm")}
            readOnly
            styles={(theme) => ({
              input: {
                "&:focus-within": {
                  borderColor: theme.colors.gray[4],
                },
                cursor: "default",
              },
            })}
          />
          <Space h="md" />
        </>
      );
    }

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
              cursor: "default",
            },
          })}
        />
        <Space h="md" />
      </>
    );
  };

  return (
    <Modal
      open={modalView}
      onCancel={close}
      title="Appointment Information"
      destroyOnClose
      footer={
        <Button
          onClick={() => {
            dispatch(toggleAppointments({ modalView: true, modalEdit: true }));
          }}
        >
          Edit
        </Button>
      }
      width={400}
      centered
    >
      <div style={{ height: "50vh", display: "flex", flexDirection: "column" }}>
        {info({
          label: "Client",
          value: `${appointment.client?.Firstname} ${appointment.client?.Lastname}`,
        })}
        {info({ label: "Title", value: appointment.title })}
        {info({ label: "Date", value: appointment.date })}
        {info({ label: "Time", value: appointment.date })}
        {info({
          label: "Status",
          value: appointment.status ? "Active" : "Not Active",
        })}
      </div>
      <EditAppointmentModal />
    </Modal>
  );
};

export default ViewAppointmentModal;

import { useEffect, useState } from "react";
import { Modal, DatePicker, TimePicker, Form } from "antd";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { get, isEmpty, isEqual, set } from "lodash";
import { Input, Space, Text, Button, Switch } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Check, X } from "react-feather";
import moment from "moment";

import {
  fetch as fetchAppointments,
  toggle as toggleAppointments,
  create as createAppointment,
} from "../../../store/slices/appointmentSlice";

const AddAppointmentModal = () => {
  const dispatch = useDispatch();

  const [disableTime, setDisableTime] = useState(true);
  const [showNow, setShowNow] = useState(true);

  const { selectedClient, modalAdd } = useSelector(
    (state) => state.appointment,
    isEqual
  );

  const defaultValues = {
    title: "",
    date: "",
    time: "",
    status: true,
  };
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      //remove the am pm from the time
      const time = moment(data.time, ["hh:mm a"]).format("hh:mm");
      data.dateTime = moment(data.date).format("YYYY-MM-DD") + " " + time;

      const updateData = {
        clientId: selectedClient,
        title: data.title,
        dateTime: data.dateTime,
        status: data.status,
      };

      const res = await dispatch(createAppointment(updateData));

      dispatch(fetchAppointments());
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
        icon: <X />,
        color: "red",
      });
    }
  };

  const close = () => {
    reset();
    resetField();
    dispatch(toggleAppointments({ modalAdd: false }));
  };

  const inputFields = ({ label, register, errors }) => {
    if (label === "Date") {
      return (
        <>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <DatePicker
            disabledDate={(current) => {
              //disable the dates before today
              //if the date is today and it's past 5pm disable it

              return (
                moment(current).endOf("day") < moment().endOf("day") &&
                moment().format("HH:mm") > "17:00"
              );
            }}
            onChange={(date, dateString) => {
              date ? setDisableTime(false) : setDisableTime(true);
              setValue("date", dateString);
            }}
          />
          {errors && (
            <>
              <Text color="red" fz="sm">
                {errors}
              </Text>
            </>
          )}
          <Space h="md" />
        </>
      );
    }

    if (label === "Time") {
      return (
        <>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <TimePicker
            use12Hours={"h:mm"}
            minuteStep={5}
            format="h:mm"
            showNow={showNow}
            disabled={disableTime}
            disabledTime={(current) => {
              //check the date field if it is today
              //if today check the current time if it's past 5pm
              //if past 5pm disable all the past hours time and minutes
              //if not past 5pm. disable the past hours time

              const date = getValues("date");
              if (!date) return {};
              if (date) {
                const now = moment().format("YYYY-MM-DD");
                if (date === now) {
                  if (moment().format("HH:mm") > "17:00") {
                    setShowNow(false);
                    return {
                      disabledHours: () => {
                        return [...Array(24).keys()].splice(0, 17);
                      },
                      disabledMinutes: () => {
                        return [...Array(60).keys()];
                      },
                    };
                  } else {
                    setShowNow(true);
                    return {
                      disabledHours: () => {
                        return [...Array(24).keys()].splice(
                          0,
                          moment().format("HH")
                        );
                      },
                    };
                  }
                } else {
                  setShowNow(true);
                  return {
                    disabledHours: () => {
                      return [];
                    },
                  };
                }
              }
            }}
            onChange={(time, timeString) => {
              setValue("time", timeString);
            }}
          />
          {errors && (
            <>
              <Text color="red" fz="sm">
                {errors}
              </Text>
            </>
          )}
          <Space h="md" />
        </>
      );
    }

    if (label === "Status") {
      return (
        <>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <Switch
            label="Active"
            defaultChecked={true}
            register={register}
            onChange={(event) => {
              setValue("status", event.target.checked);
            }}
          />
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
          {...register}
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
    <Modal
      open={modalAdd}
      onCancel={close}
      title="Appointment Information"
      maskClosable={false}
      destroyOnClose
      footer={[]}
      width={400}
      centered
    >
      <Form onFinish={handleSubmit(onSubmit)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {inputFields({
            label: "Title",
            register: register("title", {
              required: "Title is a required field",
            }),
            errors: errors.title?.message,
          })}
          {inputFields({
            label: "Date",
            register: register("date", {
              required: "Date is a required field",
            }),
            errors: errors.date?.message,
          })}
          {inputFields({
            label: "Time",
            register: register("time", {
              required: "Time is a required field",
              validate: (value) => {
                //check the date field if it is empty
                //if empty return "Please select a date first"
                //if the date is not empty and time is not empty
                //check if the date and time is not in the past
                //if in the past return "Please select a date and time in the future"

                const date = getValues("date");
                if (!date) return "Please select a date first";
                if (date && value) {
                  const dateTime = moment(date + " " + value).format(
                    "YYYY-MM-DD hh:mm"
                  );
                  const now = moment().format("YYYY-MM-DD hh:mm");
                  if (dateTime < now)
                    return "Please select a date and time in the future";
                }
                return true;
              },
            }),
            errors: errors.time?.message,
          })}
          {inputFields({
            label: "Status",
            register: register("status"),
          })}
          <Space h="md" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              justifyContent: "end",
              alignItems: "end",
            }}
          >
            <Button
              variant="outline"
              onClick={() => {
                close();
              }}
            >
              <Text>Cancel</Text>
            </Button>
            <Button type="submit">
              <Text>Save</Text>
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddAppointmentModal;

import { useEffect, useState } from "react";
import { Modal, DatePicker, TimePicker, Form } from "antd";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { isEqual } from "lodash";
import { Input, Space, Text, Button, Switch } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Check, X } from "react-feather";
import moment from "moment";

import {
  fetch as fetchAppointments,
  toggle as toggleAppointments,
  update as updateAppointment,
  deleted as deleteAppointment,
  setSelected,
} from "../../../store/slices/appointmentSlice";

const EditAppointmentModal = () => {
  const dispatch = useDispatch();

  const [showNow, setShowNow] = useState(true);

  const {
    data: appointments,
    selectedAppointment: selectedAppointment,
    modalEdit,
  } = useSelector((state) => state.appointment, isEqual);

  const defaultValues = {
    title: "",
    date: "",
    time: "",
    status: "",
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
        title: data.title,
        dateTime: data.dateTime,
        status: data.status,
      };

      const res = await dispatch(
        updateAppointment({ Id: selectedAppointment.id, data: updateData })
      );

      dispatch(fetchAppointments());
      dispatch(toggleAppointments({ modalEdit: false }));
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
    dispatch(toggleAppointments({ modalView: true, modalEdit: false }));
  };

  const editFields = ({ label, register, errors }) => {
    if (label === "Date") {
      return (
        <>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <DatePicker
            disabledDate={(current) => {
              //disable the dates before today
              return moment(current).endOf("day") < moment().endOf("day");
            }}
            onChange={(date, dateString) => {
              setValue("date", dateString);
            }}
            defaultValue={moment(selectedAppointment.date)}
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
            format="h:mm "
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
            defaultValue={moment(selectedAppointment.date)}
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
            defaultChecked={selectedAppointment.status}
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

  useEffect(() => {
    if (selectedAppointment) {
      setValue("title", selectedAppointment.title);
      setValue("date", moment(selectedAppointment.date).format("YYYY-MM-DD"));
      setValue("status", selectedAppointment.status);
      setValue("time", moment(selectedAppointment.date).format("h:mm a"));
    }
  }, [selectedAppointment]);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, []);

  return (
    <Modal
      open={modalEdit}
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
          {editFields({
            label: "Title",
            register: register("title", {
              required: "Title is a required field",
            }),
            errors: errors.title?.message,
          })}
          {editFields({
            label: "Date",
            register: register("date", {
              required: "Date is a required field",
            }),
            errors: errors.date?.message,
          })}
          {editFields({
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
          {editFields({
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

export default EditAppointmentModal;

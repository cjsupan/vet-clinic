import { use, useEffect, useState } from "react";
import { Modal, Form, message, Select } from "antd";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { isEqual, set, sortBy } from "lodash";
import { Input, Space, Text, Button, Switch, ScrollArea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import {
  toggle as toggleUser,
  update as updateUser,
  fetch as fetchUsers,
} from "../../../store/slices/userSlice";
import { EyeOff, Eye, Check, X } from "react-feather";

const EditUserModal = () => {
  const dispatch = useDispatch();

  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

  const {
    data: users,
    selectedUser,
    loading,
    modalEdit,
  } = useSelector((state) => state.user, isEqual);

  const defaultValues = {
    Email: "",
    Firstname: "",
    Lastname: "",
    Contact: "",
    Role: "",
    Password: "",
    Confirmpassword: "",
    Active: true,
  };
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      delete data.ConfirmPassword;
      const res = await dispatch(updateUser({ Id: selectedUser._id, data }));

      dispatch(fetchUsers());
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
    dispatch(toggleUser({ modalAdd: false }));
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

  const validatePassword = (value) => {
    if (value !== getValues("Password")) {
      return "Password not match";
    }
    return true;
  };

  const validateEmail = (value) => {
    //validate email format using regex pattern from https://emailregex.com/
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) {
      return "Invalid email format";
    }
    //check if email if the email is already taken.
    //if its already taken, check the id if it is the same with the selected user id
    //if it is the same return true
    //else return false
    const isEmailTaken = users.some((user) => user.Email === value);
    if (isEmailTaken) {
      if (selectedUser.Email === value) {
        return true;
      }
      return "Email is already taken";
    }

    return true;
  };

  useEffect(() => {
    if (selectedUser) {
      setValue("Firstname", selectedUser.Firstname);
      setValue("Lastname", selectedUser.Lastname);
      setValue("Email", selectedUser.Email);
      setValue("Contact", selectedUser.Contact);
      setValue("Active", selectedUser.Active);
      setValue("Role", selectedUser.Role);
      setValue("Password", selectedUser.Password);
    }
  }, [modalEdit]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [modalEdit]);

  const fields = ({ label, errors, register, onChange }) => {
    if (label === "Role") {
      return (
        <>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <Space h="sm" />
          <Select
            placeholder={label}
            onChange={onChange}
            defaultValue={selectedUser.Role}
            options={[
              {
                label: "Admin",
                value: "Admin",
              },
              {
                label: "User",
                value: "User",
              },
            ]}
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

    if (label === "Contact Number") {
      return (
        <>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <Space h="sm" />
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

    if (label === "Password") {
      return (
        <>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <Space h="sm" />

          <Input
            placeholder={label}
            size="sm"
            type={!viewPassword ? "password" : ""}
            rightSection={
              !viewPassword ? (
                <EyeOff
                  style={{ width: "15px", color: "gray" }}
                  onClick={() => {
                    setViewPassword(true);
                  }}
                />
              ) : (
                <Eye
                  style={{ width: "15px", color: "gray" }}
                  onClick={() => {
                    setViewPassword(false);
                  }}
                />
              )
            }
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

    if (label === "Confirm Password") {
      return (
        <>
          <Text fz="md" fw="400">
            {label}
          </Text>
          <Space h="sm" />

          <Input
            placeholder={label}
            size="sm"
            type={!viewConfirmPassword ? "password" : ""}
            rightSection={
              !viewConfirmPassword ? (
                <EyeOff
                  style={{ width: "15px", color: "gray" }}
                  onClick={() => {
                    setViewConfirmPassword(true);
                  }}
                />
              ) : (
                <Eye
                  style={{ width: "15px", color: "gray" }}
                  onClick={() => {
                    setViewConfirmPassword(false);
                  }}
                />
              )
            }
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
          <Space h="sm" />
          <Switch
            onLabel="Yes"
            offLabel="No"
            size="md"
            defaultChecked={true}
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
        <Space h="sm" />

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
        title="Edit User"
        open={modalEdit}
        destroyOnClose
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
                label: "Email Address",
                register: {
                  ...register("Email", {
                    required: "Email is a required field",
                    validate: (val) => validateEmail(val),
                  }),
                },
                errors: errors.Email?.message,
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
              {/* TODO: add password and confirm password fields */}
              {fields({
                label: "Password",
                register: {
                  ...register("Password", {
                    required: "Password is a required field",
                  }),
                },
                errors: errors.Password?.message,
              })}
              {fields({
                label: "Confirm Password",
                register: {
                  ...register("Confirmpassword", {
                    required: "Confirm password is a required field",
                    validate: (val) => validatePassword(val),
                  }),
                },
                errors: errors.Confirmpassword?.message,
              })}

              {fields({
                label: "Role",
                onChange: (val) => {
                  if (val) {
                    clearErrors("Role");
                    setValue("Role", val);
                  } else {
                    setError("Role", {
                      type: "required",
                      message: "Role is a required field",
                    });
                  }
                },
                register: {
                  ...register("Role", {
                    required: "Role is a required field",
                  }),
                },
                errors: errors.Role?.message,
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

export default EditUserModal;

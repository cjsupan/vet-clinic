import { useState } from "react";
import { Modal, Form, message } from "antd";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { isEqual, sortBy } from "lodash";
import { Input, Space, Text, Button, Switch, ScrollArea } from "@mantine/core";
import moment from "moment";
import { toggle as toggleUser } from "../../../store/slices/userSlice";

const ViewUserModal = () => {
  const dispatch = useDispatch();
  const { modalView, selectedUser } = useSelector(
    (state) => state.user,
    isEqual
  );

  const close = () => {
    dispatch(toggleUser({ modalView: false }));
  };

  const fields = ({ label, value, errors, register }) => {
    return (
      <>
        <Text fz="md" fw="400">
          {label}
        </Text>
        <Space h="sm" />
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
        title="User's Information"
        open={modalView}
        onCancel={close}
        footer={null}
        width={600}
        centered
        keyboard={false}
        maskClosable={false}
      >
        <div style={{ width: "100%", height: "80vh" }}>
          <ScrollArea style={{ height: "80vh", padding: "10px 20px" }}>
            {fields({ label: "Email", value: selectedUser.Email })}
            {fields({ label: "Firstname", value: selectedUser.Firstname })}
            {fields({ label: "Lastname", value: selectedUser.Lastname })}
            {fields({ label: "Contact Number", value: selectedUser.Contact })}
            {fields({ label: "Role", value: selectedUser.Role })}
            {fields({
              label: "Status",
              value: selectedUser.Active ? "Active" : "Not Active",
            })}
          </ScrollArea>
        </div>
      </Modal>
    </>
  );
};

export default ViewUserModal;

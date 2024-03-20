import Head from "next/head";
import { useMemo, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { Text, ScrollArea, Table, Button } from "@mantine/core";
import { Popconfirm } from "antd";
import { Edit, Trash, Eye, CheckCircle, XCircle } from "react-feather";
import "antd/dist/antd.css";
import { isEqual, sortBy } from "lodash";
import {
  fetch as fetchUsers,
  toggle,
  setSelected as setSelectedUser,
  deleted as deleteUser,
} from "../store/slices/userSlice";
import AddUserModal from "../components/modals/users/addUser";
import ViewUserModal from "../components/modals/users/viewUser";
import EditUserModal from "../components/modals/users/editUser";

const Users = () => {
  const dispatch = useDispatch();

  const { data: users, loading: usersLoading } = useSelector(
    (state) => state.user,
    isEqual
  );

  const userItems = useMemo(() => {
    const data = users;

    if (data)
      return sortBy(
        data.map((d) => {
          return {
            firstname: d.Firstname,
            lastname: d.Lastname,
            Email: d.Email,
            Role: d.Role,
            status: d.Active,
            id: d._id,
          };
        })
      );
    else return [];
  }, [users]);

  const handleAdd = () => {
    dispatch(toggle({ modalAdd: true }));
  };

  const handleView = async (Id) => {
    const data = await users.find((d) => d._id === Id);

    await dispatch(setSelectedUser(data));
    dispatch(toggle({ modalView: true }));
  };

  const handleEdit = async (Id) => {
    const data = await users.find((d) => d._id === Id);
    dispatch(setSelectedUser(data));
    dispatch(toggle({ modalEdit: true }));
  };

  const handleDelete = async (Id) => {
    await dispatch(deleteUser(Id));
    dispatch(fetchUsers());
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const rows = userItems.map((d) => (
    <tr key={d.id}>
      <td>
        <Text lineClamp={1} className="table-items firstname select-none">
          {d.firstname}
        </Text>
      </td>
      <td>
        <Text lineClamp={1} className="table-items lastname">
          {d.lastname}
        </Text>
      </td>
      <td>
        <Text lineClamp={1} className="table-items Email">
          {d.Email}
        </Text>
      </td>
      <td>
        <Text className="table-items role">{d.Role}</Text>
      </td>
      <td>
        <Text className="table-items status">
          {d.status ? (
            <CheckCircle width={"18px"} color="green" />
          ) : (
            <XCircle width={"18px"} color="red" />
          )}
        </Text>
      </td>
      <td>
        <div className="table-items actions">
          <Eye
            width={"18px"}
            color="gray"
            style={{ cursor: "pointer" }}
            onClick={() => handleView(d.id)}
          />
          <Edit
            width={"18px"}
            color="gray"
            style={{ cursor: "pointer" }}
            onClick={() => handleEdit(d.id)}
          />
          <Popconfirm
            title={"Are you sure to delete this item?"}
            onConfirm={() => handleDelete(d.id)}
          >
            <Trash width={"18px"} color="gray" style={{ cursor: "pointer" }} />
          </Popconfirm>
        </div>
      </td>
    </tr>
  ));

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <div className="flex flex-col space-y-4 p-8 pb-4">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text fw={500} size={"xl"}>
            Users
          </Text>
          <Button
            style={{ width: "100px", alignSelf: "end" }}
            onClick={handleAdd}
          >
            Add User
          </Button>
        </div>

        <div className="userTable">
          <ScrollArea
            h={"70vh"}
            scrollbarSize={8}
            style={{ borderRadius: "4px" }}
          >
            <Table striped highlightOnHover fontSize="md">
              <thead className="thead">
                <tr>
                  <th className="firstname">
                    <Text>Firstname</Text>
                  </th>
                  <th className="lastname">
                    <Text>Lastname</Text>
                  </th>
                  <th className="Email">
                    <Text>Email</Text>
                  </th>
                  <th>
                    <Text>Role</Text>
                  </th>
                  <th className="status">
                    <Text>Status</Text>
                  </th>
                  <th className="actions">
                    <Text>Actions</Text>
                  </th>
                </tr>
              </thead>
              <tbody className="tbody">{rows}</tbody>
            </Table>
          </ScrollArea>
        </div>
      </div>
      <AddUserModal />
      <EditUserModal />
      <ViewUserModal />
    </>
  );
};

export default Users;

//use getServerSideProps to check if user is authenticated. If not, redirect to login page
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else if (session.user.Role !== "Admin") {
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

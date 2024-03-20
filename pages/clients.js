import Head from "next/head";
import { useEffect, useMemo } from "react";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { isEqual, sortBy } from "lodash";
import { Text, ScrollArea, Button, Table } from "@mantine/core";
import { Popconfirm } from "antd";
import { Edit, Trash, Eye, CheckCircle, XCircle } from "react-feather";
import "antd/dist/antd.css";

import {
  fetch as fetchClients,
  search,
  toggle as toggleClients,
  setSelected as setSelectedClients,
  deleted as deleteClients,
  setSelected,
} from "../store/slices/clientSlice";
import AddClientModal from "../components/modals/clients/addClient";
import ViewClientModal from "../components/modals/clients/viewClient";
import EditClientModal from "../components/modals/clients/editClient";

const Clients = () => {
  const dispatch = useDispatch();

  const { data: clients, loading: clientsLoading } = useSelector(
    (state) => state.client,
    isEqual
  );

  const clientItems = useMemo(() => {
    const data = clients;

    if (data)
      return sortBy(
        data.map((d) => {
          return {
            firstname: d.Firstname,
            lastname: d.Lastname,
            email: d.Email,
            contact: d.Contact,
            address: d.Address,
            status: d.Active,
            id: d._id,
          };
        })
      );
    else return [];
  }, [JSON.stringify(clients)]);

  const handleAdd = () => {
    dispatch(toggleClients({ modalAdd: true }));
  };

  const handleView = (id) => {
    const selectedClient = clientItems.find((d) => d.id === id);
    dispatch(setSelected(selectedClient));
    dispatch(toggleClients({ modalView: true }));
  };

  const handleEdit = (id) => {
    const selectedClient = clients.find((d) => d._id === id);
    dispatch(setSelected(selectedClient));
    dispatch(toggleClients({ modalEdit: true }));
  };

  const handleDelete = async (id) => {
    try {
      const res = await dispatch(deleteClients(id));

      if (res) {
        dispatch(fetchClients());
        notifications.show({
          title: "Success",
          message: res.message,
          color: "teal",
          icon: <Check />,
        });
      }
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.message,
        color: "red",
        icon: <X />,
      });
    }
  };

  useEffect(() => {
    dispatch(fetchClients());
  }, []);

  const rows = clientItems.map((d) => (
    <tr key={d.id}>
      <td>
        <Text lineClamp={1} className="table-items firstname select-none">
          {d.firstname}
        </Text>
      </td>
      <td>
        <Text lineClamp={1} className="table-items lastname select-none">
          {d.lastname}
        </Text>
      </td>
      <td>
        <Text lineClamp={1} className="table-items email select-none">
          {d.email}
        </Text>
      </td>
      <td>
        <Text lineClamp={1} className="table-items contact">
          {`+63${d.contact}`}
        </Text>
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
        <title>Clients</title>
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
            Clients
          </Text>
          <Button
            style={{ alignSelf: "end", height: "30px" }}
            onClick={handleAdd}
          >
            Add Client
          </Button>
        </div>
        <div className="clientTable">
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
                  <th className="email">
                    <Text>Email</Text>
                  </th>
                  <th className="contact">
                    <Text>Contact</Text>
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
      <AddClientModal />
      <ViewClientModal />
      <EditClientModal />
    </>
  );
};

export default Clients;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

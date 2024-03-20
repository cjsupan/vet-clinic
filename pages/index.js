import React, { useCallback, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { isEqual } from "lodash";
import ErrorPage from "next/error";
import { useSession, getSession } from "next-auth/react";
import { fetch as fetchUsers } from "../store/slices/userSlice";
import { fetch as fetchClients } from "../store/slices/clientSlice";

const Home = ({ session }) => {
  const dispatch = useDispatch();

  const { data: users, loading: usersLoading } = useSelector(
    (state) => state.user,
    isEqual
  );
  const { data: clients, loading: clientsLoading } = useSelector(
    (state) => state.client,
    isEqual
  );

  const cards = [
    {
      title: "Users",
      href: "/users",
      value: users ? users.length : 0,
      color: "bg-rose-500",
    },
    {
      title: "Clients",
      href: "/clients",
      value: clients ? clients.length : 0,
      color: "bg-cyan-500",
    },
    {
      title: "Appointments",
      href: "/appointments",
      value: 5,
      color: "bg-amber-400",
    },
  ];

  //if session.user.Role is not admin, remove the users menu item.
  if (session && session.user.Role !== "Admin") {
    cards.splice(0, 1);
  }

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchClients());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h1>
        <div className="flex flex-wrap space-x-6 w-full p-8 pb-4">
          {cards.map(({ title, href, value, color }) => (
            <Link href={href} key={title}>
              <div
                className={`grid ${color} w-56 h-24 rounded-lg shadow-lg p-2`}
              >
                <h1 className="text-white text-xl font-semibold">{title}</h1>
                <h1 className=" justify-self-end mr-4 text-white text-xl font-semibold text-end">
                  {value}
                </h1>
              </div>
            </Link>
          ))}
        </div>
      </h1>
    </>
  );
};

export default Home;

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

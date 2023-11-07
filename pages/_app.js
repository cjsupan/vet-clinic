import { useEffect } from "react";
import Layout from "../components/layout";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import store from "../store";
import { Notifications } from "@mantine/notifications";
import "../styles/global.scss";
import "../styles/users.scss";
import "../styles/clients.scss";
import "../styles/appointments.scss";
import "tailwindcss/tailwind.css";
import "antd/dist/antd.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <SessionProvider session={pageProps.session} store={store}>
        <Notifications />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;

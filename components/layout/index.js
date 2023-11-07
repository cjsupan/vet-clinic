import Head from "next/head";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const Header = dynamic(() => import("../layout/Header"));
const Sidebar = dynamic(() => import("../layout/Sidebar"));

function Layout({ children }) {
  const { data: session } = useSession();
  return (
    <div className="Body">
      <Head>
        <title>Vet Clinic</title>
      </Head>
      <div className="flex flex-row w-full h-screen main-container">
        {session && <Sidebar />}
        <div className="flex flex-col w-full">
          <Header />
          <div className="w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
export default Layout;

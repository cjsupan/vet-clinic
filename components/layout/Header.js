import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Text } from "@mantine/core";
import { Menu, Dropdown } from "antd";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(); // Clear the session
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed");
    }
  };

  if (status !== "authenticated") {
    return null;
  }

  const items = [
    {
      label: (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            padding: "5px 0px",
          }}
        >
          <Text>Profile</Text>
          <Image src="/profile.svg" alt="profile" width={15} height={15} />
        </div>
      ),
      onClick: () => {},
      key: "0",
    },
    {
      label: (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            padding: "5px 0px",
          }}
        >
          <Text>Sign out</Text>
          <Image src="/log-out.svg" alt="logout" width={15} height={15} />
        </div>
      ),
      onClick: () => handleLogout(),
      key: "1",
    },
  ];

  return (
    <div className="Header">
      <div className="profileBox">
        <div className="profileName">
          <Text fz="md">{"Welcome,"} </Text>
          <Text fz="md" fw={500} tt={"capitalize"}>
            {session.user?.Firstname.toLowerCase()}
          </Text>
        </div>
        <Dropdown
          overlayStyle={{ width: "120px", margin: "0px", padding: " 0px" }}
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <div className="profilePicture">
            <img
              src={"/profile.svg"}
              alt="profile picture"
              width="100%"
              height="100%"
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;

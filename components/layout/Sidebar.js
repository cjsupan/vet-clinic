import { useState, useRef, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { Users, User, Database, Calendar, Grid, Menu } from "react-feather";
import { Text, Burger } from "@mantine/core";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toggle as toggleSidebar } from "../../store/slices/utilitySlice";

const Sidebar = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);

  const { sideBarOpen } = useSelector((state) => state.utility);

  const menuItems = [
    {
      href: "/",
      title: "Dashboard",
      icon: <Grid className="icons" />,
    },
    {
      href: "/users",
      title: "Users",
      icon: <User className="icons" />,
    },
    {
      href: "/clients",
      title: "Clients",
      icon: <Users className="icons" />,
    },
    {
      href: "/appointments",
      title: "Appointment",
      icon: <Calendar className="icons" />,
    },
    {
      href: "/",
      title: "Backup/Restore",
      icon: <Database className="icons" />,
    },
  ];

  //if the session.user.Role is not admin, remove the users menu item.
  if (session && session.user.Role !== "Admin") {
    menuItems.splice(1, 1);
  }

  useEffect(() => {
    if (session && session.user.Role !== "Admin") {
      menuItems.splice(1, 1);
    }
  }, [session]);

  if (!session || status === "unauthenticated") {
    return null;
  }

  return (
    <div
      className={`Sidebar ${sideBarOpen ? "Sidebar-open" : ""} `}
      ref={sidebarRef}
    >
      <Menu
        className={`Menu-icon ${sideBarOpen ? "Open" : "Close"}`}
        onClick={() => dispatch(toggleSidebar({ sideBarOpen: !sideBarOpen }))}
      />
      <div className="Menu">
        {menuItems.map((d) => (
          <Link href={d.href} key={d.title}>
            <Text className={`Menu-item ${sideBarOpen ? "Open" : "Close"}`}>
              {d.icon}
              <Text
                className={`item ${sideBarOpen ? "item-open" : "item-close"}`}
              >
                {d.title}
              </Text>
            </Text>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

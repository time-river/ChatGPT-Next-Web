import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";

import { NavItemDef } from "./types";

export const categories: NavItemDef[] = [
  {
    title: "Overview",
    icon: <DashboardIcon />,
    path: "/dashboard",
    disabled: false,
    external: false,
  },
  {
    title: "Orders",
    icon: <ShoppingCartIcon />,
    path: "/dashboard/Orders",
    disabled: false,
    external: false,
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    path: "/dashboard/settings",
    disabled: false,
    external: false,
  },
  {
    title: "Chat",
    icon: <SettingsIcon />,
    path: "/",
    disabled: false,
    external: false,
  },
];

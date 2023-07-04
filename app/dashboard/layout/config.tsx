import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

import { NavItemDef } from "./types";
import { Path as ChatPath } from "@/app/constant";

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
    title: "Chat",
    icon: <ChatBubbleIcon />,
    path: ChatPath.Home,
    disabled: false,
    external: false,
  },
];

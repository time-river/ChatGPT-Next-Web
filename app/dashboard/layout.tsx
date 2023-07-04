"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Box from "@mui/material/Box";
import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "simplebar-react/dist/simplebar.min.css";

import { SideNav } from "./layout/SideNav";
import { SIDE_NAV_WIDTH, TopNav } from "./layout/TopNav";
import { createTheme } from "./components/theme";
import Copyright from "../components/Copyright";
import AuthGuard from "../layout/AuthGuard";

// leave a space for leftbar
const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

// copyright vertical alignment
const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

const theme = createTheme();

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname],
  );

  return (
    <AuthGuard>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <TopNav onNavOpen={() => setOpenNav(true)} />
          <SideNav onClose={() => setOpenNav(false)} open={openNav} />
          <LayoutRoot>
            <LayoutContainer>
              {children}
              <Copyright />
            </LayoutContainer>
          </LayoutRoot>
        </Box>
      </ThemeProvider>
    </AuthGuard>
  );
}

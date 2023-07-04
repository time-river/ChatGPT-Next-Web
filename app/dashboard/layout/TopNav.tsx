import Bars3Icon from "../icons/bars-3.svg";
import {
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import { TopNavProps } from "./types";

export const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props: TopNavProps) => {
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "sticky",
          left: {
            lg: `${SIDE_NAV_WIDTH}px`,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2,
          }}
        >
          {!lgUp && (
            <IconButton onClick={onNavOpen}>
              <SvgIcon fontSize="small">
                <Bars3Icon />
              </SvgIcon>
            </IconButton>
          )}
        </Stack>
      </Box>
    </>
  );
};

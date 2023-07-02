"use client";

import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import globalCfg from "@/global.config";

const Copyright = (props: any) => {
  const { domain, domainName, domainFrom } = globalCfg;

  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href={domain}>
        {domainName}
      </Link>{" "}
      {domainFrom}-{new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;

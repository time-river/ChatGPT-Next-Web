import {
  Paper,
  Card,
  CardContent,
  Stack,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";
import Link from "next/link";
import Title from "./title";

interface BalanceProps {
  sx: SxProps<Theme>;
}

export default function Balance(props: BalanceProps) {
  const { sx } = props;

  return (
    <>
      <Paper sx={sx}>
        <Title>Balance</Title>
        <Typography component="p" variant="h4">
          $3,024.00
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          on 15 March, 2019
        </Typography>
        <div>
          <Link color="primary" href="#" onClick={() => {}}>
            View balance
          </Link>
        </div>
      </Paper>
    </>
  );
}

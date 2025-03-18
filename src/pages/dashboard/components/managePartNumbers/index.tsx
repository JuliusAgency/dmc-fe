import { Container, Grid, Paper, Typography } from "@mui/material";
import { PartNumberTable } from "./part-number-table";

const MANAGE_PART_NUMBERS_TITLE = "Manage Part Numbers";

const PAPER_STYLE = {
  p: 3,
  borderRadius: 2,
  boxShadow: 1,
  backgroundColor: "#f9f9f9",
  textAlign: "left",
};

export function ManagePartNumbers() {
  return (
    <Container sx={{ direction: "ltr", textAlign: "left" }}>
      <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>
        {MANAGE_PART_NUMBERS_TITLE}
      </Typography>

      <Grid container spacing={4} justifyContent="flex-start">
        <Grid item xs={12}>
          <Paper sx={PAPER_STYLE}>
            <PartNumberTable />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

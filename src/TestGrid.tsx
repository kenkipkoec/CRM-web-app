import { Grid, TextField } from "@mui/material";

export default function TestGrid() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField label="Test" />
      </Grid>
    </Grid>
  );
}
import React from "react";
import { Grid } from "@mui/material";
import ReactLoading from "react-loading";

// eslint-disable-next-line react/prop-types
const Loading = ({ type, color }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <ReactLoading type={type} color={color} height={"20%"} width={"20%"} />

    </Grid>
  );
};

export default Loading;

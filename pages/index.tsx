import React, { useState } from "react";
import type { NextPage } from "next";
import { Container, Snackbar, Alert, AlertColor, Box, Avatar, Typography, IconButton } from "@mui/material";
import TodoList from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import { TodoContext } from "../components/TodoContext";
import { useAuth } from "../Auth";
import { auth } from "../firebase";
import { verifyIdToken } from "../firebaseAdmin";
import { getDocs, collection, orderBy, query, where } from "@firebase/firestore";
import { db } from "../firebase";
import nookies from "nookies";

// eslint-disable-next-line react/prop-types
const Home: NextPage<any> = ({ todosProps }) => {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [todo, setTodo] = useState({
    title: "", detail: ""
  });
  const [alertType, setAlertType] = useState<AlertColor>("success");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const showAlert = (type: AlertColor, msg: React.SetStateAction<string>) => {
    setAlertType(type);
    setAlertMessage(msg);
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <TodoContext.Provider value={{ showAlert, todo, setTodo }}>
      <Container maxWidth='sm'>
        <Box sx={{ display: "flex", justifyContent: "space-between" }} mt={3}>
          <IconButton onClick={() => auth.signOut()}>
            <Avatar src={currentUser.photoURL} />
          </IconButton>
          <Typography variant="h5">
            {currentUser.displayName}
          </Typography>
        </Box>
        <TodoForm />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={open} autoHideDuration={6000} onClose={handleClose} >
          <Alert onClose={handleClose} severity={alertType} sx={{ width: "100%" }}>
            {alertMessage}
          </Alert>
        </Snackbar >
        <TodoList todosProps={todosProps} />
      </Container >
    </TodoContext.Provider >
  );
};

export async function getServerSideProps(context: any) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { email } = token;

    const collectionRef = collection(db, "todos");
    const q = query(collectionRef, where("email", "==", email), orderBy("timestamp", "desc"));

    const querySnapshot = await getDocs(q);
    let todos: any[] = [];
    querySnapshot.forEach((doc) => {
      todos.push({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp.toDate().getTime() });
    });
    return {
      props: {
        todosProps: JSON.stringify(todos) || [],
      }
    };
  } catch (error) {
    return { props: {} };
  }
}

export default Home;

import React, { useContext, useRef, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "@firebase/firestore";
import { TodoContext } from "./TodoContext";
import { useAuth } from "../Auth";

const TodoForm = () => {
  const inputAreaRef = useRef();
  const { currentUser } = useAuth();
  const { showAlert, todo, setTodo } = useContext(TodoContext);
  const onSubmit = async () => {
    if (todo?.hasOwnProperty("timestamp")) {
      // update the todo timestamp
      const docRef = doc(db, "todos", todo.id);
      const todoUpdated = { ...todo, timestamp: serverTimestamp() };
      updateDoc(docRef, todoUpdated);
      showAlert("success", `Todo with id ${docRef.id} is added successfully`);
    } else {
      const collectionRef = collection(db, "todos");
      const docRef = await addDoc(collectionRef, { ...todo, email: currentUser.email, timestamp: serverTimestamp() });
      setTodo({
        title: "", detail: ""
      });
      showAlert("success", `Todo with id ${docRef.id} is added successfully`);
    }

  };

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (!inputAreaRef.current.contains(e.target)) {
        console.log("Outside input area");
        setTodo({
          "title": "", detail: ""
        });
      } else {
        console.log("Inside input area");
      };
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [setTodo]);

  return (
    <div ref={inputAreaRef}>
      <TextField
        fullWidth
        label="title"
        margin="normal"
        value={todo.title}
        onChange={(e => setTodo({ ...todo, title: e.target.value }))}
      />
      <TextField
        fullWidth
        label="detail"
        multiline
        maxRows={4}
        value={todo.detail}
        onChange={(e => setTodo({ ...todo, detail: e.target.value }))}
      />
      <Button onClick={onSubmit} variant="contained" sx={{ mt: 3 }}>
        {todo.hasOwnProperty("timestamp") ? "Update todo" : "Add a new todo"}
      </Button>
    </div>
  );
};

export default TodoForm;

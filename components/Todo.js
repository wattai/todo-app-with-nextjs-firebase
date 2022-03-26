import React, { useContext } from "react";
import moment from "moment";
import { ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TodoContext } from "./TodoContext";
import { db } from "../firebase";
import { deleteDoc, doc } from "@firebase/firestore";
import { useRouter } from "next/router";


// eslint-disable-next-line react/prop-types
function Todo({ id, timestamp, title, detail }) {
  const { showAlert, setTodo } = useContext(TodoContext);
  const router = useRouter();

  const deleteTodo = async (_id, e) => {
    e.stopPropagation();
    const docRef = doc(db, "todos", _id);
    await deleteDoc(docRef);
    showAlert("error", `Todo with id ${_id} deleted successfully`);
  };

  const seeMore = (_id, e) => {
    e.stopPropagation();
    router.push(`/todos/${_id}`);
  };

  return (
    <ListItem
      onClick={() => setTodo({ id, title, detail, timestamp })}
      sx={{ mt: 3, boxShadow: 3 }}
      style={{ backgroundColor: "#FAFAFA" }}
      secondaryAction={
        <>
          <IconButton onClick={e => deleteTodo(id, e)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={e => seeMore(id, e)}>
            <MoreVertIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={title}
        secondary={moment(timestamp).format("MMMM dd, yyyy")}
      />
    </ListItem>
  );
}

export default Todo;

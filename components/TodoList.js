import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import { db } from "../firebase";
import Todo from "./Todo";
import { useAuth } from "../Auth";

// eslint-disable-next-line react/prop-types, @typescript-eslint/no-unused-vars
function TodoList({ todosProps }) {
  const [todos, setTodos] = useState([]);
  const { currentUser } = useAuth();

  // TODO: Fix a bug while rendering in server side.
  useEffect(() => {
    if (todosProps) {
      setTodos(JSON.parse(todosProps));
    }
  }, [todosProps]);

  useEffect(() => {
    const collectionRef = collection(db, "todos");

    const q = query(collectionRef, where("email", "==", currentUser?.email), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setTodos(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate().getTime(),
        }))
      );
    });
    return unsubscribe;
  }, [currentUser?.email]);

  return (
    <div>
      {todos.map((todo) => (
        <Todo
          id={todo.id}
          key={todo.id}
          title={todo.title}
          detail={todo.detail}
          timestamp={todo.timestamp}
        />
      ))}
    </div>
  );
}

export default TodoList;

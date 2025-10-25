import { createContext, useMemo, useState, useEffect, useReducer } from "react";
import io from "socket.io-client";

export const ChatContext = createContext();

export const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };

    case "NEW_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg._id === action.payload._id ? action.payload : msg
        ),
      };

    case "DELETE_MESSAGE":
      return {
        ...state,
        messages: state.messages.filter(
          (msg) => msg._id !== action.payload._id
        ),
      };

    default:
      return state;
  }
};

const ChatContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, { messages: [] });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("initial messages", (msgs) => {
      dispatch({ type: "SET_MESSAGES", payload: msgs });
    });

    newSocket.on("new message", (msg) => {
      dispatch({ type: "NEW_MESSAGE", payload: msg });
    });

    newSocket.on("update message", (msg) => {
      dispatch({ type: "UPDATE_MESSAGE", payload: msg });
    });

    newSocket.on("delete message", (msg) => {
      dispatch({ type: "DELETE_MESSAGE", payload: msg });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      dispatch,
      socket,
    }),
    [state, socket]
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export default ChatContextProvider;

import { useContext } from "react";
import { ChatContext } from "../context/ChatContextProvider.js";

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatContextProvider");
  }
  return context;
};

export default useChat;

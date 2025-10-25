import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider.js";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  const { user, dispatch } = context;
  return { user, dispatch };
};

export default useAuth;

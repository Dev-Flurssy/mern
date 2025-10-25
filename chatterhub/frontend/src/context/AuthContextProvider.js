import { useReducer, useEffect, createContext, useCallback } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "SIGNIN":
      return { user: action.payload };
    case "SIGNOUT":
      return { user: null };
    case "UPDATE":
      return { user: { ...state.user, ...action.payload } };
    case "DELETE_USER":
      return { user: null };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch({ type: "SIGNIN", payload: storedUser });
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  const signin = useCallback((user) => {
    dispatch({ type: "SIGNIN", payload: user });
  }, []);

  const signout = useCallback(() => {
    dispatch({ type: "SIGNOUT" });
  }, []);

  const updateUser = useCallback((updates) => {
    dispatch({ type: "UPDATE", payload: updates });
  }, []);

  const deleteUser = useCallback(() => {
    dispatch({ type: "DELETE_USER" });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: state.user, signin, signout, updateUser, deleteUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

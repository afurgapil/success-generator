import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useType = () => {
  const { type } = useContext(UserContext);
  return type;
};

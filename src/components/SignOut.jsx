import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
const Signout = () => {
  const navigate = useNavigate();
  const { signout } = useContext(UserContext);
  const handleSignout = () => {
    signout();
    navigate("/signin");
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white  px-6 py-2 rounded-xl"
      onClick={handleSignout}
    >
      <FaSignOutAlt></FaSignOutAlt>
    </button>
  );
};

export default Signout;

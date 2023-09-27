import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Unauthorized from "../components/Unauthorized";

// eslint-disable-next-line react/prop-types
function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const { type } = useContext(UserContext);

  useEffect(() => {
    if (type === "parent") {
      setIsAuth(true);
      setLoading(false);
    }
  }, [type]);

  if (loading) {
    return <Unauthorized />;
  }

  if (isAuth) {
    return children;
  } else {
    return <Navigate to="/signin" />;
  }
}

export default PrivateRoute;

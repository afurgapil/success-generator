import { createContext, useState, useEffect } from "react";
const UserContext = createContext();
import API_URL from "../config";

// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [type, setType] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedType = localStorage.getItem("type");
    if (storedUser && storedToken && storedType) {
      setUser(JSON.parse(storedUser));
      setToken(JSON.parse(storedToken));
      setType(JSON.parse(storedType));
    }
  }, []);
  const signup = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log("Kullanıcı başarıyla kaydedildi.");
        const data = await response.json();
        setUser(data.user);
        setToken(data.token);
      } else {
        const data = await response.json();
        console.error("Kullanıcı kaydı başarısız:", data.error);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };
  const signin = async (email, password, isChecked) => {
    try {
      const response = await fetch(`${API_URL}/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(data.token);
        setType(data.type);
        if (isChecked) {
          localStorage.setItem("token", JSON.stringify(data.token));
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("type", JSON.stringify(data.type));
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const signinStudent = async (name, password, isChecked) => {
    try {
      const response = await fetch(`${API_URL}/student/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(data.token);
        setType(data.type);
        if (isChecked) {
          localStorage.setItem("token", JSON.stringify(data.token));
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("type", JSON.stringify(data.type));
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const signout = () => {
    setUser(null);
    setType(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("type");
  };

  return (
    <UserContext.Provider
      value={{ user, token, type, signup, signin, signinStudent, signout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

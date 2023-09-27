import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
//component
import Header from "./components/Header";
import Footer from "./components/Footer";
//route
import ParentRoute from "./route/ParentRoute";
import StudentRoute from "./route/StudentRoute";
//pages
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Recover from "./pages/Recover";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AddResult from "./pages/AddResult";
import Results from "./pages/Results";

function App() {
  const publicRoutes = [
    { path: "/signup", component: SignUp },
    { path: "/signin", component: SignIn },
    { path: "/recover", component: Recover },
    { path: "/", component: Home },
  ];
  const parentRoutes = [
    { path: "/profile", component: Profile },
    { path: "/dashboard", component: Dashboard },
  ];
  const studentRoutes = [
    { path: "/add-result", component: AddResult },
    { path: "/results", component: Results },
  ];
  return (
    <UserProvider>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          {parentRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ParentRoute>
                  <route.component />
                </ParentRoute>
              }
            />
          ))}
          {studentRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <StudentRoute>
                  <route.component />
                </StudentRoute>
              }
            />
          ))}
          <Route path="/*" element={<NotFound></NotFound>}></Route>
        </Routes>

        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

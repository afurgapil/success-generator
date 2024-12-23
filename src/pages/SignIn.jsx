import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { isValidMail } from "../utils/isValidMail";
//store
function SignIn() {
  const navigate = useNavigate();
  const { signin, signinStudent } = useContext(UserContext);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkMail, setCheckMail] = useState(false);
  const [isLong, setIsLong] = useState(true);
  const [error, setError] = useState({ bool: false, message: "" });
  const [isParent, setIsParent] = useState(true);
  const [student, setStudent] = useState({
    name: "",
    password: "",
  });
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };
  const checkPasswordValid = () => {
    if (!isValidMail(email)) {
      setCheckMail(true);
      return false;
    }

    if (password.length < 8) {
      setIsLong(false);
      return false;
    }
    setCheckMail(false);
    setIsLong(true);

    return true;
  };

  const handleSubmitParent = async (e) => {
    e.preventDefault();
    const isPasswordValid = checkPasswordValid();

    if (!isPasswordValid) {
      return;
    }

    try {
      await signin(email, password, isChecked);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmitStudent = async (e) => {
    e.preventDefault();

    try {
      await signinStudent(student.name, student.password, isChecked);
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <div className="dark:bg-slate-900 bg-gray-100 flex min-h-screen items-start py-16">
      <div className="w-full max-w-md mx-auto p-6">
        <label className="flex items-center justify-center space-x-2 cursor-pointer">
          <span className="text-gray-600">Öğrenci</span>
          <div
            className={`w-14 h-7 bg-gray-300 rounded-full p-1 flex items-center ${
              isParent ? "bg-red-500" : "bg-indigo-500"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform ${
                isParent ? "translate-x-7" : ""
              } transition-transform duration-300 ease-in-out`}
            ></div>
          </div>
          <span className="text-gray-600">Veli</span>
          <input
            type="checkbox"
            className="hidden"
            checked={isParent}
            onChange={() => {
              setIsParent(!isParent);
            }}
          />
        </label>
        {isParent ? (
          <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                  Giriş
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Henüz bir hesabınız yok mu?
                  <Link
                    className="text-blue-600 decoration-2 hover:underline font-medium"
                    to="/signup"
                  >
                    {" "}
                    Kayıt Ol!
                  </Link>
                </p>
              </div>

              <div className="mt-5">
                {/* <button
                type="button"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
              >
                <svg
                  className="w-4 h-auto"
                  width="46"
                  height="47"
                  viewBox="0 0 46 47"
                  fill="none"
                >
                  <path
                    d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                    fill="#34A853"
                  />
                  <path
                    d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign in with Google
              </button>

              <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
                Or
              </div> */}

                <form onSubmit={handleSubmitParent}>
                  <div className="grid gap-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        E-Mail
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          required
                          aria-describedby="email-error"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <div
                          className={`
                      ${!checkMail ? "hidden" : "flex"}
                       absolute inset-y-0 right-0  items-center pointer-events-none pr-3`}
                        >
                          <svg
                            className="h-5 w-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                      <p
                        className={` ${
                          !checkMail ? "hidden" : "flex"
                        } text-xs text-red-600 mt-2"`}
                        id="email-error"
                      >
                        Lütfen geçerli bir mail adresi giriniz.
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="password"
                          className="block text-sm mb-2 dark:text-white"
                        >
                          Şifre
                        </label>
                        <Link
                          className="text-sm text-blue-600 decoration-2 hover:underline font-medium"
                          to="/recover"
                        >
                          Şifremi Unuttum
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          required
                          aria-describedby="password-error"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div
                          className={` ${
                            isLong ? "hidden" : "flex"
                          } absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3`}
                        >
                          <svg
                            className="h-5 w-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                      <p
                        className={`${
                          isLong ? "hidden" : "flex"
                        } text-xs text-red-600 mt-2"`}
                        id="password-error"
                      >
                        Minimum 8 karakter.
                      </p>
                    </div>

                    <div className="flex items-center">
                      <div className="flex">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600  focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                      <div className="ml-3">
                        <label
                          htmlFor="remember-me"
                          className="text-sm dark:text-white"
                        >
                          Beni Hatırla
                        </label>
                      </div>
                    </div>
                    <p
                      className={`${
                        error.bool ? "flex" : "hidden"
                      } text-xs text-red-600 mt-2`}
                      id="confirm-password-error"
                    >
                      {error.message}
                    </p>
                    <button
                      type="submit"
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    >
                      Giriş
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                  Giriş
                </h1>
              </div>
              <div className="mt-5">
                <form onSubmit={handleSubmitStudent}>
                  <div className="grid gap-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        Ad
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          required
                          aria-describedby="email-error"
                          value={student.name}
                          onChange={(e) =>
                            setStudent({ ...student, name: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="password"
                          className="block text-sm mb-2 dark:text-white"
                        >
                          Şifre
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          required
                          aria-describedby="password-error"
                          value={student.password}
                          onChange={(e) =>
                            setStudent({ ...student, password: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600  focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                      <div className="ml-3">
                        <label
                          htmlFor="remember-me"
                          className="text-sm dark:text-white"
                        >
                          Beni Hatırla
                        </label>
                      </div>
                    </div>
                    <p
                      className={`${
                        error.bool ? "flex" : "hidden"
                      } text-xs text-red-600 mt-2`}
                      id="confirm-password-error"
                    >
                      {error.message}
                    </p>
                    <button
                      type="submit"
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    >
                      Giriş
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignIn;

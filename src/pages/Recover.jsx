import { useState } from "react";
import { isValidMail } from "../utils/isValidMail";
function Recover() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);

  // const checkPasswordValid = () => {
  //   if (!isValidMail(email)) {
  //     setIsValid(false);
  //     return false;
  //   }
  //   return true;
  // };
  // const handleRecover = async (e) => {
  //   e.preventDefault();
  //   const isPasswordValid = checkPasswordValid();

  //   if (!isPasswordValid) {
  //     return;
  //   }

  //   try {
  //   } catch (error) {}
  // };
  return (
    <div className="dark:bg-slate-900 bg-gray-100 flex min-h-screen items-start py-16">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Şifrenizi mi unuttunuz?
              </h1>
            </div>

            <div className="mt-5">
              <form>
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
                        className={`${
                          !isValid ? "flex" : "hidden"
                        }  absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3`}
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
                        !isValid ? "flex" : "hidden"
                      } text-xs text-red-600 mt-2`}
                      id="email-error"
                    >
                      Lütfen geçerli bir mail adresi giriniz
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  >
                    Şifreyi sıfırla
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recover;

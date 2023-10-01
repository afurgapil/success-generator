import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { AiFillDelete } from "react-icons/ai";
import API_URL from "../config";

function Profile() {
  const user = useUser();
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [graduation, setGraduation] = useState("");
  const [niveau, setNiveau] = useState("");

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/user/get-students/${user.id}`);
      if (!response.ok) {
        throw new Error("Öğrenciler getirilirken hata oluştu.");
      }
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error("Öğrenciler getirilirken hata oluştu:", error);
    }
  };
  const handleAddStudent = async () => {
    const parent_id = user.id;
    try {
      const response = await fetch(`${API_URL}/user/add-student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password, graduation, niveau, parent_id }),
      });

      if (!response.ok) {
        throw new Error("Öğrenci eklenirken hata oluştu.");
      }

      closeModal();
      fetchStudents();
      setName("");
      setPassword("");
      setGraduation("");
      setNiveau("");
    } catch (error) {
      console.error("Öğrenci eklenirken hata oluştu:", error);
    }
  };
  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`${API_URL}/user/delete-student/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Öğrenci silinirken hata oluştu.");
      }

      fetchStudents();
    } catch (error) {
      console.error("Öğrenci silinirken hata oluştu:", error);
    }
  };
  return (
    <div className="bg-bg min-h-screen py-6 px-12 flex flex-col md:flex-row">
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-opacity duration-300`}
      >
        <div className="bg-white w-96 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Student</h2>
          <input
            type="text"
            placeholder="Ad"
            className="w-full p-2 border rounded mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Öğrenci Şifresi"
            className="w-full p-2 border rounded mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="hs-tooltip flex items-center w-full my-3">
            <div className="flex flex-row items-center justify-center w-full">
              <button
                onClick={() => {
                  setGraduation("LGS");
                }}
                className={`${
                  graduation === "LGS"
                    ? "py-3 px-8 text-xl"
                    : " py-1 px-2 text-lg"
                } items-center  rounded-full  font-medium bg-indigo-300 text-indigo-800 mx-2 transition-all duration-500 ease-out`}
              >
                LGS
              </button>
              <button
                onClick={() => {
                  setGraduation("YKS");
                }}
                className={`${
                  graduation === "YKS"
                    ? "py-3 px-8 text-xl"
                    : "py-1 px-2 text-lg"
                } items-center  rounded-full  font-medium bg-orange-300 text-orange-800 mx-2 transition-all duration-500 ease-out`}
              >
                YKS
              </button>
            </div>
          </div>
          {graduation === "YKS" ? (
            <div className="flex flex-row justify-center items-center transition-all duration-1000 ease-linear mx-auto my-4">
              <button
                type="button"
                onClick={() => {
                  setNiveau("EA");
                }}
                className={`${
                  niveau === "EA"
                    ? "bg-red-500 border-red-500 text-white"
                    : "text-red-500"
                } py-3 px-4 mx-2  inline-flex justify-center items-center gap-2 rounded-md border-2 border-red-200 font-semibold text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all text-sm dark:focus:ring-offset-gray-800`}
              >
                EA
              </button>
              <button
                type="button"
                onClick={() => {
                  setNiveau("SAY");
                }}
                className={`${
                  niveau === "SAY"
                    ? "bg-yellow-500 border-yellow-500 text-white"
                    : "text-yellow-500"
                } py-3 px-4 mx-2  inline-flex justify-center items-center gap-2 rounded-md border-2 border-yellow-200 font-semibold  hover:text-white hover:bg-yellow-500 hover:border-yellow-500   transition-all text-sm dark:focus:ring-offset-gray-800`}
              >
                SAY
              </button>
              <button
                type="button"
                onClick={() => {
                  setNiveau("SÖZ");
                }}
                className={`${
                  niveau === "SÖZ"
                    ? "bg-green-500 border-green-500 text-white"
                    : "text-green-500"
                } py-3 px-4 mx-2  inline-flex justify-center items-center gap-2 rounded-md border-2 border-green-200 font-semibold  hover:text-white hover:bg-green-500 hover:border-green-500 transition-all text-sm dark:focus:ring-offset-gray-800`}
              >
                SÖZ
              </button>
              <button
                type="button"
                onClick={() => {
                  setNiveau("DİL");
                }}
                className={`${
                  niveau === "DİL"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "text-blue-500"
                } py-3 px-4 mx-2  inline-flex justify-center items-center gap-2 rounded-md border-2 border-blue-200 font-semibold text-blue-500 hover:text-white hover:bg-blue-500 hover:border-blue-500   transition-all text-sm dark:focus:ring-offset-gray-800`}
              >
                DİL
              </button>
            </div>
          ) : null}

          <div className="w-full flex flex-row justify-between items-center ">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded mr-2 transition-all duration-500 ease-out"
            >
              Vazgeç
            </button>
            <button
              onClick={handleAddStudent}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-all duration-500 ease-out"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 h-1/2  bg-slate-400 p-8 shadow-md rounded-lg mx-2">
        <div className="text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile Picture"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h1 className="text-2xl font-semibold">{user.e_mail}</h1>
        </div>
      </div>
      <div className="w-full md:w-1/2 mt-10 md:mt-0">
        <h2 className="text-white text-4xl text-center border-b border-white mx-2">
          Çocuklarınız
        </h2>
        {students.length > 0 ? (
          <div className="flex flex-col">
            <ul>
              {students.map((student) => (
                <div
                  key={student.Id}
                  className="flex flex-row items-center justify-between my-2 "
                >
                  <div className="flex flex-row items-center justify-start">
                    <span
                      className={`${
                        student.Graduation === "LGS"
                          ? "bg-indigo-300"
                          : "bg-orange-300"
                      } w-3 h-3 block rounded-full mr-2`}
                    />
                    <span className="text-gray-600 dark:text-gray-400 text-3xl">
                      {student.Name}
                    </span>
                  </div>
                  <button
                    className="text-blue-500 hover:text-red-500 transition-all duration-200 ease-linear scale-110"
                    onClick={() => {
                      handleDeleteStudent(student.Id);
                    }}
                  >
                    <AiFillDelete size="30px"></AiFillDelete>
                  </button>
                </div>
              ))}
            </ul>
            <button
              type="button"
              className="my-4 mx-auto w-11/12 py-2 inline-flex justify-center items-center rounded-md bg-indigo-100 border border-transparent font-semibold text-indigo-500 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 ring-offset-white focus:ring-indigo-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
              onClick={openModal}
            >
              Ekle!
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <button
              type="button"
              className="my-4 mx-auto w-11/12 py-2 inline-flex justify-center items-center rounded-md bg-indigo-100 border border-transparent font-semibold text-indigo-500 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 ring-offset-white focus:ring-indigo-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
              onClick={openModal}
            >
              Ekle!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

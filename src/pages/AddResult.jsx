/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import API_URL from "../config";

function AddResult() {
  const user = useUser();
  const [tyt, setTyt] = useState([]);
  const [ayt, setAyt] = useState([]);
  const [generalModal, setGeneralModal] = useState(false);
  const [courseModal, setCourseModal] = useState(false);
  const [examResult, setExamResult] = useState({
    type: "",
    selectedDate: "",
    trueAnswer: "",
    falseAnswer: "",
    emptyAnswer: "",
    result: "",
    isCalculated: false,
  });
  const [courseResult, setCourseResult] = useState({
    course: "",
    courseId: "",
    selectedDate: "",
    trueAnswer: "",
    falseAnswer: "",
    emptyAnswer: "",
    result: "",
    isCalculated: false,
  });
  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/student/get-courses/${user.Id}`);
      if (!response.ok) {
        throw new Error("Dersler getirilirken hata oluştu.");
      }
      const data = await response.json();
      setTyt(data.tyt);
      setAyt(data.ayt);
    } catch (error) {
      console.error("Dersler getirilirken hata oluştu:", error);
    }
  };
  const handleExamDateChange = (e) => {
    setExamResult((prevResult) => ({
      ...prevResult,
      selectedDate: e.target.value,
    }));
  };
  const handleCourseDateChange = (e) => {
    setCourseResult((prevResult) => ({
      ...prevResult,
      selectedDate: e.target.value,
    }));
  };
  const handleExamCalculateResult = () => {
    const minus = examResult.falseAnswer / 4;
    const res = examResult.trueAnswer - minus;
    setExamResult((prevResult) => ({
      ...prevResult,
      result: res,
      isCalculated: true,
    }));
  };
  const handleCourseCalculateResult = () => {
    const minus = courseResult.falseAnswer / 4;
    const res = courseResult.trueAnswer - minus;
    setCourseResult((prevResult) => ({
      ...prevResult,
      result: res,
      isCalculated: true,
    }));
  };
  const handleExamResult = async () => {
    const stundetId = user.Id;
    try {
      const response = await fetch(`${API_URL}/student/add-result/general`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stundetId,
          type: examResult.type,
          date: examResult.selectedDate,
          trueAnswer: examResult.trueAnswer,
          falseAnswer: examResult.falseAnswer,
          emptyAnswer: examResult.emptyAnswer,
          result: examResult.result,
        }),
      });

      if (!response.ok) {
        throw new Error("Result eklenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Result eklenirken hata oluştu:", error);
    }
  };
  const handleCourseResult = async () => {
    try {
      const response = await fetch(`${API_URL}/student/add-result/course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: courseResult.course,
          courseId: courseResult.courseId,
          date: courseResult.selectedDate,
          trueAnswer: courseResult.trueAnswer,
          falseAnswer: courseResult.falseAnswer,
          emptyAnswer: courseResult.emptyAnswer,
          result: courseResult.result,
        }),
      });

      if (!response.ok) {
        throw new Error("Result eklenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Result eklenirken hata oluştu:", error);
    }
  };
  const clearExamCache = async () => {
    setGeneralModal(false);
    setExamResult((prevResult) => ({
      ...prevResult,
      type: "",
      selectedDate: "",
      trueAnswer: "",
      falseAnswer: "",
      emptyAnswer: "",
      result: "",
      isCalculated: false,
    }));
  };
  const clearCourseCache = async () => {
    setCourseModal(false);
    setCourseResult((prevResult) => ({
      ...prevResult,
      course: "",
      courseId: "",
      selectedDate: "",
      trueAnswer: "",
      falseAnswer: "",
      emptyAnswer: "",
      result: "",
      isCalculated: false,
    }));
  };
  return (
    <div className="bg-bg min-h-screen py-6 px-12 flex flex-col md:flex-col">
      {generalModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50  transition-opacity duration-300`}
        >
          <div className="bg-white w-96 p-4 flex flex-col gap-y-2 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Add {examResult.type} Result
            </h2>
            <div className="">
              <label
                htmlFor="dateInput"
                className="block text-gray-700 font-semibold"
              >
                Select a Date:
              </label>
              <input
                type="date"
                id="dateInput"
                value={examResult.selectedDate}
                onChange={handleExamDateChange}
                className="border w-full rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <input
              type="number"
              id="true"
              placeholder="True Answer"
              className="w-full p-2 border rounded mb-2"
              value={examResult.trueAnswer}
              onChange={(e) => {
                setExamResult((prevResult) => ({
                  ...prevResult,
                  trueAnswer: e.target.value,
                }));
              }}
            />

            <input
              type="number"
              id="false"
              placeholder="False Answer"
              className="w-full p-2 border rounded mb-2"
              value={examResult.falseAnswer}
              onChange={(e) => {
                setExamResult((prevResult) => ({
                  ...prevResult,
                  falseAnswer: e.target.value,
                }));
              }}
            />

            <input
              type="number"
              id="empty"
              placeholder="Empty Answer"
              className="w-full p-2 border rounded mb-2"
              value={examResult.emptyAnswer}
              onChange={(e) => {
                setExamResult((prevResult) => ({
                  ...prevResult,
                  emptyAnswer: e.target.value,
                }));
              }}
            />
            <input
              type="number"
              id="result"
              disabled
              placeholder="Result"
              className="w-full p-2 border rounded mb-2"
              value={examResult.result}
              onChange={(e) => {
                setExamResult((prevResult) => ({
                  ...prevResult,
                  result: e.target.value,
                }));
              }}
            />

            <div className="w-full flex flex-row justify-between items-center ">
              <button
                onClick={() => {
                  setGeneralModal(false);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded mr-2 transition-all duration-500 ease-out"
              >
                Back
              </button>
              {examResult.isCalculated && (
                <button
                  onClick={() => {
                    setExamResult((prevResult) => ({
                      ...prevResult,
                      result: 0,
                      isCalculated: false,
                    }));
                  }}
                  className=" px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded transition-all duration-500 ease-out"
                >
                  Reset
                </button>
              )}
              {examResult.isCalculated ? (
                <button
                  onClick={() => {
                    handleExamResult();
                    clearExamCache();
                  }}
                  className=" px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-all duration-500 ease-out"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleExamCalculateResult();
                  }}
                  className="px-4 py-2 bg-red-500 text-white hover:bg-red-700 rounded mr-2 transition-all duration-500 ease-out"
                >
                  Calculate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {courseModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50  transition-opacity duration-300`}
        >
          <div className="bg-white w-96 p-4 flex flex-col gap-y-2 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Add {courseResult.course} Result
            </h2>
            <div className="">
              <label
                htmlFor="dateInput"
                className="block text-gray-700 font-semibold"
              >
                Select a Date:
              </label>
              <input
                type="date"
                id="dateInput"
                value={courseResult.selectedDate}
                onChange={handleCourseDateChange}
                className="border w-full rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <input
              type="number"
              id="true"
              placeholder="True Answer"
              className="w-full p-2 border rounded mb-2"
              value={courseResult.trueAnswer}
              onChange={(e) => {
                setCourseResult((prevResult) => ({
                  ...prevResult,
                  trueAnswer: e.target.value,
                }));
              }}
            />

            <input
              type="number"
              id="false"
              placeholder="False Answer"
              className="w-full p-2 border rounded mb-2"
              value={courseResult.falseAnswer}
              onChange={(e) => {
                setCourseResult((prevResult) => ({
                  ...prevResult,
                  falseAnswer: e.target.value,
                }));
              }}
            />

            <input
              type="number"
              id="empty"
              placeholder="Empty Answer"
              className="w-full p-2 border rounded mb-2"
              value={courseResult.emptyAnswer}
              onChange={(e) => {
                setCourseResult((prevResult) => ({
                  ...prevResult,
                  emptyAnswer: e.target.value,
                }));
              }}
            />
            <input
              type="number"
              id="result"
              disabled
              placeholder="Result"
              className="w-full p-2 border rounded mb-2"
              value={courseResult.result}
              onChange={(e) => {
                setCourseResult((prevResult) => ({
                  ...prevResult,
                  result: e.target.value,
                }));
              }}
            />

            <div className="w-full flex flex-row justify-between items-center ">
              <button
                onClick={() => {
                  setCourseModal(false);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded mr-2 transition-all duration-500 ease-out"
              >
                Back
              </button>
              {courseResult.isCalculated && (
                <button
                  onClick={() => {
                    setCourseResult((prevResult) => ({
                      ...prevResult,
                      result: 0,
                      isCalculated: false,
                    }));
                  }}
                  className=" px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded transition-all duration-500 ease-out"
                >
                  Reset
                </button>
              )}
              {courseResult.isCalculated ? (
                <button
                  onClick={() => {
                    handleCourseResult();
                    clearCourseCache();
                  }}
                  className=" px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-all duration-500 ease-out"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleCourseCalculateResult();
                  }}
                  className="px-4 py-2 bg-red-500 text-white hover:bg-red-700 rounded mr-2 transition-all duration-500 ease-out"
                >
                  Calculate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col ">
        <h2 className="text-white text-center text-5xl font-bold mb-8 ">
          General Exams
        </h2>
        <div className="flex flex-col my-4 md:flex-row justify-around items-center">
          {user.Graduation === "YKS" ? (
            <>
              <button
                type="button"
                className="py-3 px-4 my-2 w-full md:w-1/3 inline-flex justify-center items-center gap-2 rounded-md bg-pink-100 border border-transparent font-semibold text-3xl text-pink-500 hover:text-pink-900 hover:bg-pink-400 focus:outline-none focus:ring-2 ring-offset-white focus:ring-pink-500 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800"
                onClick={() => {
                  setGeneralModal(true);
                  setExamResult((prevResult) => ({
                    ...prevResult,
                    type: "TYT",
                  }));
                }}
              >
                Add TYT
              </button>
              <button
                type="button"
                className="py-3 px-4 my-2 w-full md:w-1/3 inline-flex justify-center items-center gap-2 rounded-md bg-green-100 border border-transparent font-semibold text-3xl text-green-500 hover:text-green-900 hover:bg-green-400 focus:outline-none focus:ring-2 ring-offset-white focus:ring-green-500 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800"
                onClick={() => {
                  setGeneralModal(true);
                  setExamResult((prevResult) => ({
                    ...prevResult,
                    type: "AYT",
                  }));
                }}
              >
                Add AYT
              </button>
            </>
          ) : (
            <button
              type="button"
              className="py-3 px-4 my-2 w-full md:w-1/3 inline-flex justify-center items-center gap-2 rounded-md bg-green-100 border border-transparent font-semibold text-3xl text-green-500 hover:text-green-900 hover:bg-green-400 focus:outline-none focus:ring-2 ring-offset-white focus:ring-green-500 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800"
              onClick={() => {
                setGeneralModal(true);
                setExamResult((prevResult) => ({
                  ...prevResult,
                  type: "LGS",
                }));
              }}
            >
              Add LGS
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col my-4  justify-around items-center w-full">
        <h2 className="text-white text-center text-5xl font-bold mb-8 ">
          Course Exams
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center  md:justify-evenly md:items-start w-full">
          <ul className="flex flex-col justify-center">
            {tyt.map((course) => (
              <button
                key={course.Id}
                type="button"
                className="py-3 px-4 my-1 inline-flex justify-center items-center gap-2 rounded-md border-2 border-indigo-200 font-semibold text-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2 transition-all text-xl dark:focus:ring-offset-gray-800"
                onClick={() => {
                  setCourseResult((prevResult) => ({
                    ...prevResult,
                    course: course.Name,
                    courseId: course.Id,
                  }));
                  setCourseModal(true);
                }}
              >
                {course.Name}
              </button>
            ))}
          </ul>
          {ayt.length > 0 ? (
            <ul className="flex flex-col">
              {ayt.map((course) => (
                <button
                  key={course.Id}
                  type="button"
                  className="py-3 px-4 my-1 inline-flex justify-center items-center gap-2 rounded-md border-2 border-red-200 font-semibold text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 transition-all text-xl dark:focus:ring-offset-gray-800"
                  onClick={() => {
                    setCourseResult((prevResult) => ({
                      ...prevResult,
                      course: course.Name,
                      courseId: course.Id,
                    }));
                    setCourseModal(true);
                  }}
                >
                  {course.Name}
                </button>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AddResult;

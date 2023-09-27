/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import API_URL from "../config";
import { AiFillCaretDown } from "react-icons/ai";
function Results() {
  const user = useUser();
  const [exams, setExams] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [courseResults, setCourseResults] = useState([]);
  const [openCourse, setOpenCourse] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchCourseResults();
      fetchExamResults();
    }
  }, [user]);

  const handleCourseClick = (courseId) => {
    if (openCourse === courseId) {
      setOpenCourse(null);
    } else {
      setOpenCourse(courseId);
    }
  };
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/student/get-courses/${user.Id}`);
      if (!response.ok) {
        throw new Error("Dersler getirilirken hata oluştu.");
      }
      const data = await response.json();
      const merged = [...data.tyt, ...data.ayt];
      setExams(merged);
    } catch (error) {
      console.error("Dersler getirilirken hata oluştu:", error);
    }
  };
  const fetchCourseResults = async () => {
    try {
      const response = await fetch(
        `${API_URL}/student/get-courseResults/${user.Id}`
      );
      if (!response.ok) {
        throw new Error("Dersler getirilirken hata oluştu.");
      }
      const data = await response.json();
      setCourseResults(data.data);
    } catch (error) {
      console.error("Dersler getirilirken hata oluştu:", error);
    }
  };
  const fetchExamResults = async () => {
    try {
      const response = await fetch(
        `${API_URL}/student/get-examResults/${user.Id}`
      );
      if (!response.ok) {
        throw new Error("Dersler getirilirken hata oluştu.");
      }
      const data = await response.json();
      setExamResults(data.data);
    } catch (error) {
      console.error("Dersler getirilirken hata oluştu:", error);
    }
  };
  return (
    <div className="bg-bg min-h-screen py-6 px-12 flex flex-col md:flex-col">
      <div className="flex flex-col my-4  justify-around items-center w-full">
        <h2 className="text-white text-center text-5xl font-bold mb-8 ">
          General Exams
        </h2>
        <div className="flex flex-col justify-start items-center  w-full">
          <ul className="flex flex-col justify-center w-full">
            <div className="flex flex-col">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            Id
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            True
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                          >
                            False
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                          >
                            Empty
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                          >
                            Result
                          </th>
                        </tr>
                      </thead>
                      {examResults.map((exam) => (
                        <tbody key={exam.Id}>
                          <tr
                            className={`${
                              exam.Type === "TYT"
                                ? "bg-slate-800"
                                : "bg-orange-600"
                            } `}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200">
                              {exam.Id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                              {exam.Date.slice(0, 10)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                              {exam.TrueAnswer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white font-medium">
                              {exam.FalseAnswer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white font-medium">
                              {exam.EmptyAnswer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white font-medium">
                              {exam.Result}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </ul>
        </div>
        <h2 className="text-white text-center text-5xl font-bold mb-8 ">
          Course Exams
        </h2>
        <div className="flex flex-col justify-start items-center w-full">
          <ul className="flex flex-col justify-center w-full">
            {exams.map((course) => (
              <div
                key={course.Id}
                className="flex flex-col justify-center items-center "
              >
                <div className="w-full gap-y-2 my-2 flex flex-row justify-between items-center py-3 px-4 border-2  text-indigo-500   hover:text-white  border-indigo-200  hover:bg-indigo-500 ">
                  <button
                    type="button"
                    className="w-full my-1  text-center rounded-md  font-semibold hover:text-white    transition-all text-xl"
                    onClick={() => handleCourseClick(course.Id)}
                  >
                    {course.Name}
                  </button>
                  <AiFillCaretDown color="white" size="48px"></AiFillCaretDown>
                </div>
                <table
                  className={`
                    ${openCourse === course.Id ? "table" : "hidden"}
                w-full   divide-y divide-gray-200 dark:divide-gray-700`}
                >
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Id
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Course
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        True
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                      >
                        False
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                      >
                        Empty
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                      >
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseResults
                      .filter((course) => course.Course_Id === openCourse)
                      .map((course) => (
                        <tr key={course.Id} className={``}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200">
                            {course.Id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200">
                            {course.Course}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                            {course.Date.slice(0, 10)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                            {course.TrueAnswer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white font-medium">
                            {course.FalseAnswer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white font-medium">
                            {course.EmptyAnswer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white font-medium">
                            {course.Result}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  //sinav sonuclarini fetchle
}

export default Results;

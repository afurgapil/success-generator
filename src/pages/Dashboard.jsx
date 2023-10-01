import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import API_URL from "../config";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  MarkSeries,
} from "react-vis";
import { LineSeries, VerticalBarSeries, VerticalGridLines } from "react-vis";

function Dashboard() {
  const user = useUser();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState();
  const [tyt, setTyt] = useState([]);
  const [ayt, setAyt] = useState([]);
  const [tytAvarage, setTytAvarage] = useState(null);
  const [aytAvarage, setAytAvarage] = useState(null);
  const [examAvarage, setExamAvarage] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [courseLength, setCourseLength] = useState("");
  const [courseData, setCourseData] = useState({});
  const [windowWidth, setWindowWidth] = useState((window.innerWidth / 10) * 9);
  const colors = [
    "#FF5733",
    "#FF33FF",
    "#33FF33",
    "#3333FF",
    "#FFFF33",
    "#33FFFF",
    "#FF3366",
    "#33FF66",
    "#6633FF",
    "#FF6633",
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth((window.innerWidth / 10) * 9);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  useEffect(() => {
    if (selectedStudent) {
      fetchExamResults();
      fetchCourseResults();
      calculateTytAvarage();
    }
  }, [selectedStudent]);
  useEffect(() => {
    if (tyt) {
      calculateTytAvarage();
    }
    if (ayt) {
      calculateAytAvarage();
    }
    if (examResults) {
      calculateExamAvarage();
    }
  }, [tyt, ayt, examResults]);
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

  const fetchExamResults = async () => {
    try {
      const response = await fetch(
        `${API_URL}/student/get-examResults/${selectedStudent.Id}`
      );
      if (!response.ok) {
        throw new Error("Dersler getirilirken hata oluştu.");
      }
      const data = await response.json();
      const examResults = data.data;
      setExamResults(examResults);
      const tytResults = examResults.filter((result) => result.Type === "TYT");
      const aytResults = examResults.filter((result) => result.Type === "AYT");
      setTyt(tytResults);
      console.log(tyt);
      setAyt(aytResults);
    } catch (error) {
      console.error("Dersler getirilirken hata oluştu:", error);
    }
  };
  const fetchCourseResults = async () => {
    try {
      const response = await fetch(
        `${API_URL}/student/get-courseResults/${selectedStudent.Id}`
      );
      if (!response.ok) {
        throw new Error("Dersler getirilirken hata oluştu.");
      }
      const data = await response.json();
      setCourseLength(data.data.length);
      let courseDat = {};
      data.data.forEach((result) => {
        const { Course, ...rest } = result;

        if (!courseDat[Course]) {
          courseDat[Course] = [];
        }

        courseDat[Course].push(rest);
      });
      setCourseData(courseDat);
    } catch (error) {
      console.error("Dersler getirilirken hata oluştu:", error);
    }
  };
  const calculateTytAvarage = () => {
    let res = 0;
    if (tyt.length > 0) {
      for (let i = 0; i < tyt.length; i++) {
        const result = parseFloat(tyt[i].Result);
        res += result;
      }
      const ava = res / tyt.length;
      setTytAvarage(ava);
    }
  };
  const calculateAytAvarage = () => {
    let res = 0;
    if (ayt.length > 0) {
      for (let i = 0; i < ayt.length; i++) {
        const result = parseFloat(ayt[i].Result);
        res += result;
      }
      const ava = res / ayt.length;
      setAytAvarage(ava);
    }
  };
  const calculateExamAvarage = () => {
    let res = 0;
    if (examResults.length > 0) {
      for (let i = 0; i < examResults.length; i++) {
        const result = parseFloat(examResults[i].Result);
        res += result;
      }
      const ava = res / examResults.length;
      setExamAvarage(ava);
    }
  };
  return (
    <div className="bg-bg min-h-screen py-6 px-12 flex flex-col justify-start items-center">
      <div className="w-full flex flex-row justify-center items-start border-b-2 border-gray-100 py-4">
        <div className="flex flex-row justify-center items-start w-2/5">
          <select
            className="py-3 px-4 pr-9 block w-full border-gray-600 bg-gray-400 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => {
              const selectedStudent = JSON.parse(e.target.value);
              setSelectedStudent(selectedStudent);
            }}
          >
            <option selected className="bg-gray-100">
              Select a student
            </option>
            {students.map((student) => (
              <option
                key={student.Id}
                className="bg-gray-200"
                value={JSON.stringify(student)}
              >
                {student.Name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedStudent && (
        <div className="">
          <div id="avarage">
            {selectedStudent.Graduation === "YKS" ? (
              <div>
                <div className="flex flex-col justify-center items-center overflow-auto py-10">
                  <h2 className="text-center text-white text-5xl">Ortalama</h2>
                  {examAvarage ? (
                    <XYPlot
                      className="my-10"
                      xType="ordinal"
                      stackBy="y"
                      width={windowWidth}
                      height={300}
                    >
                      <VerticalGridLines />
                      <HorizontalGridLines />
                      <XAxis />
                      <YAxis />
                      <VerticalBarSeries
                        cluster="2016"
                        color={
                          colors[Math.floor(Math.random() * colors.length)]
                        }
                        data={[{ x: "TYT Ortalama", y: tytAvarage }]}
                      />
                      <VerticalBarSeries
                        cluster="2016"
                        color={
                          colors[Math.floor(Math.random() * colors.length)]
                        }
                        data={[{ x: "AYT Ortalama", y: aytAvarage }]}
                      />
                    </XYPlot>
                  ) : (
                    <h3 className="my-10 underline underline-offset-2 text-gray-600  text-center text-5xl">
                      Henüz bir veri yok :/
                    </h3>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center overflow-auto py-10">
                  <h2 className="text-center text-white text-5xl">
                    Sınav Sonuçları
                  </h2>
                  {examResults.length > 0 ? (
                    <div className="mx-auto flex flex-col justify-center items-center">
                      <XYPlot width={windowWidth} height={300}>
                        <HorizontalGridLines />
                        <XAxis />
                        <YAxis />
                        <MarkSeries
                          strokeWidth={2}
                          opacity="0.8"
                          sizeRange={[15, 15]}
                          data={tyt.map((result, index) => ({
                            x: index + 1,
                            y: result.Result,
                          }))}
                        />
                        <MarkSeries
                          strokeWidth={2}
                          color="red"
                          opacity="0.8"
                          sizeRange={[15, 15]}
                          data={ayt.map((result, index) => ({
                            x: index + 1,
                            y: result.Result,
                          }))}
                        />
                        <LineSeries
                          className="first-series"
                          data={tyt.map((result, index) => ({
                            x: index + 1,
                            y: result.Result,
                          }))}
                          color="green"
                        />
                        <LineSeries
                          className="first-series"
                          data={ayt.map((result, index) => ({
                            x: index + 1,
                            y: result.Result,
                          }))}
                          color="red"
                        />
                      </XYPlot>
                    </div>
                  ) : (
                    <h3 className="my-10 underline underline-offset-2 text-gray-600  text-center text-5xl">
                      Henüz bir veri yok :/
                    </h3>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center overflow-auto py-10">
                  <h2 className="text-center text-white text-5xl">
                    Ders Sonuçları
                  </h2>
                  {courseLength > 0 ? (
                    Object.keys(courseData).map((courseName, index) => {
                      const courseResults = courseData[courseName];
                      if (courseResults.length >= 2) {
                        return (
                          <div key={courseName}>
                            <h2 className="text-white text-xl font-semibold">
                              {courseName}
                            </h2>
                            <XYPlot width={windowWidth} height={300}>
                              <HorizontalGridLines />
                              <XAxis />
                              <YAxis />
                              <MarkSeries
                                strokeWidth={2}
                                opacity="0.8"
                                sizeRange={[15, 15]}
                                data={courseResults.map((result, index) => ({
                                  x: index + 1,
                                  y: parseFloat(result.Result),
                                }))}
                                color={colors[index % colors.length]}
                              />
                              <LineSeries
                                className="first-series"
                                data={courseResults.map((result, index) => ({
                                  x: index + 1,
                                  y: parseFloat(result.Result),
                                }))}
                                color={colors[index % colors.length]}
                              />
                            </XYPlot>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : (
                    <h3 className="my-10 underline underline-offset-2 text-gray-600  text-center text-5xl">
                      Henüz bir veri yok :/
                    </h3>
                  )}
                </div>
              </div>
            ) : selectedStudent.Graduation === "LGS" ? (
              <div>
                <div className="flex flex-col justify-center items-center overflow-auto py-10">
                  <h2 className="text-center text-white text-5xl">Ortalama</h2>
                  {examResults ? (
                    <XYPlot
                      className="my-10"
                      xType="ordinal"
                      stackBy="y"
                      width={windowWidth}
                      height={300}
                    >
                      <VerticalGridLines />
                      <HorizontalGridLines />
                      <XAxis />
                      <YAxis />

                      <VerticalBarSeries
                        cluster="2016"
                        color={
                          colors[Math.floor(Math.random() * colors.length)]
                        }
                        data={[{ x: "LGS Ortalama", y: examAvarage }]}
                      />
                    </XYPlot>
                  ) : (
                    <h3 className="my-10 underline underline-offset-2 text-gray-600  text-center text-5xl">
                      Henüz bir veri yok :/
                    </h3>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center overflow-auto py-10">
                  <h2 className="text-center text-white text-5xl">
                    Sınav Sonuçları
                  </h2>
                  {examResults.length > 0 ? (
                    <XYPlot width={windowWidth} height={300}>
                      <HorizontalGridLines />
                      <XAxis />
                      <YAxis />
                      <MarkSeries
                        strokeWidth={2}
                        opacity="0.8"
                        sizeRange={[15, 15]}
                        data={examResults.map((result, index) => ({
                          x: index + 1,
                          y: result.Result,
                        }))}
                        color="red"
                      />
                      <LineSeries
                        className="first-series"
                        data={examResults.map((result, index) => ({
                          x: index + 1,
                          y: result.Result,
                        }))}
                        color="red"
                      />
                    </XYPlot>
                  ) : (
                    <h3 className="my-10 underline underline-offset-2 text-gray-600  text-center text-5xl">
                      Henüz bir veri yok :/
                    </h3>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center overflow-auto py-10">
                  <h2 className="text-center text-white text-5xl">
                    Ders Sonuçları
                  </h2>
                  {courseLength > 0 ? (
                    Object.keys(courseData).map((courseName, index) => {
                      const courseResults = courseData[courseName];
                      if (courseResults.length >= 2) {
                        return (
                          <div key={courseName}>
                            <h2 className="text-white text-xl font-semibold">
                              {courseName}
                            </h2>
                            <XYPlot width={windowWidth} height={300}>
                              <HorizontalGridLines />
                              <XAxis />
                              <YAxis />
                              <MarkSeries
                                strokeWidth={2}
                                opacity="0.8"
                                sizeRange={[15, 15]}
                                data={courseResults.map((result, index) => ({
                                  x: index + 1,
                                  y: parseFloat(result.Result),
                                }))}
                                color={colors[index % colors.length]}
                              />
                              <LineSeries
                                className="first-series"
                                data={courseResults.map((result, index) => ({
                                  x: index + 1,
                                  y: parseFloat(result.Result),
                                }))}
                                color={colors[index % colors.length]}
                              />
                            </XYPlot>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : (
                    <h3 className="my-10 underline underline-offset-2 text-gray-600  text-center text-5xl">
                      Henüz bir veri yok :/
                    </h3>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

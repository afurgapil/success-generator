/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../hooks/usePool").default;
dotenv.config();

const secretKey = process.env.SECRET_KEY;

router.post("/signin", async (req, res) => {
  try {
    const { name, password } = req.body;
    const sql = "SELECT * FROM Student WHERE Name = ?";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to get MySQL connection: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to get database connection." });
      }

      connection.query(sql, [name], (queryErr, results) => {
        connection.release();

        if (queryErr) {
          console.error(
            "An error occurred while querying: " + queryErr.message
          );
          return res.status(500).json({ error: "Failed to sign in." });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Student Not Found." });
        }

        const user = results[0];
        if (user.Password !== password) {
          return res.status(401).json({ error: "Wrong Password." });
        }

        const token = jwt.sign({ name }, secretKey);
        const type = "student";

        res.status(200).json({ user, token, type });
      });
    });
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Failed to sign in." });
  }
});
router.get("/get-courses/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const sql = "SELECT * FROM Courses WHERE Student_Id = ?";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to get MySQL connection: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to get database connection." });
      }

      connection.query(sql, [studentId], (queryErr, results) => {
        connection.release();

        if (queryErr) {
          console.error(
            "An error occurred while querying: " + queryErr.message
          );
          return res
            .status(500)
            .json({ error: "Courses could not be fetched." });
        }
        const group1 = results.slice(0, 4);
        const group2 = results.slice(4);

        res.status(200).json({ tyt: group1, ayt: group2 });
      });
    });
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Courses could not be fetched." });
  }
});
router.post("/add-result/general", async (req, res) => {
  try {
    const {
      stundetId,
      type,
      date,
      trueAnswer,
      falseAnswer,
      emptyAnswer,
      result,
    } = req.body;
    const insertSql =
      "INSERT INTO Exam_Results (Type, Date, Student_Id, TrueAnswer,FalseAnswer,EmptyAnswer,Result) VALUES (?, ?, ?, ?,?,?,?)";
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to get MySQL connection: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to get database connection." });
      }

      connection.query(
        insertSql,
        [type, date, stundetId, trueAnswer, falseAnswer, emptyAnswer, result],
        (queryErr, results) => {
          if (queryErr) {
            connection.rollback(() => {
              console.error(
                "An error occurred while querying: " + queryErr.message
              );
              return res
                .status(500)
                .json({ error: "Result could not be saved." });
            });
          }
        }
      );
    });
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Failed to add a student." });
  }
});
router.post("/add-result/course", async (req, res) => {
  try {
    const {
      course,
      courseId,
      date,
      trueAnswer,
      falseAnswer,
      emptyAnswer,
      result,
    } = req.body;
    const insertSql =
      "INSERT INTO Course_Results (Course,Course_Id, Date, TrueAnswer, FalseAnswer, EmptyAnswer, Result) VALUES (?,?, ?, ?, ?,?,?)";
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to get MySQL connection: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to get database connection." });
      }

      connection.query(
        insertSql,
        [course, courseId, date, trueAnswer, falseAnswer, emptyAnswer, result],
        (queryErr, results) => {
          if (queryErr) {
            connection.rollback(() => {
              console.error(
                "An error occurred while querying: " + queryErr.message
              );
              return res
                .status(500)
                .json({ error: "Result could not be saved." });
            });
          }
        }
      );
    });
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Failed to add a student." });
  }
});
router.get("/get-examResults/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const sql = "SELECT * FROM Exam_Results WHERE Student_Id = ?";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to get MySQL connection: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to get database connection." });
      }

      connection.query(sql, [studentId], (queryErr, results) => {
        connection.release();

        if (queryErr) {
          console.error(
            "An error occurred while querying: " + queryErr.message
          );
          return res
            .status(500)
            .json({ error: "Results could not be fetched." });
        }
        res.status(200).json({ data: results });
      });
    });
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Results could not be fetched." });
  }
});
router.get("/get-courseResults/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const coursesSql = "SELECT * FROM Courses WHERE Student_Id = ?";
    pool.query(coursesSql, [studentId], (coursesQueryErr, coursesResults) => {
      if (coursesQueryErr) {
        console.error(
          "An error occurred while querying: " + coursesQueryErr.message
        );
        return res.status(500).json({ error: "Courses could not be fetched." });
      }
      const courseIds = coursesResults.map((course) => course.Id);
      const resultsSql = "SELECT * FROM Course_Results WHERE Course_Id IN (?)";
      pool.query(resultsSql, [courseIds], (resultsQueryErr, results) => {
        if (resultsQueryErr) {
          console.error(
            "An error occurred while querying: " + resultsQueryErr.message
          );
          return res
            .status(500)
            .json({ error: "Results could not be fetched." });
        }

        res.status(200).json({ data: results });
      });
    });
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Courses could not be fetched." });
  }
});
module.exports = router;

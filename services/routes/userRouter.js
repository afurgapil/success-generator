/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../hooks/usePool").default;

dotenv.config();

const secretKey = process.env.SECRET_KEY;
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const sql = "INSERT INTO Parent (e_mail, password) VALUES (?, ?)";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to get MySQL connection: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to get database connection." });
      }

      connection.query(sql, [email, password], (queryErr, results) => {
        connection.release();

        if (queryErr) {
          console.error("Error adding a record: " + queryErr.message);
          return res.status(500).json({ error: "Error adding a register" });
        }
        const token = jwt.sign({ email }, secretKey);
        console.log("New record added successfully.");
        res.status(201).json({ user: { email }, token });
      });
    });
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Error adding a register" });
  }
});
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const sql = "SELECT * FROM Parent WHERE e_mail = ?";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to get MySQL connection: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to get database connection." });
      }

      connection.query(sql, [email], (queryErr, results) => {
        connection.release();

        if (queryErr) {
          console.error(
            "An error occurred while querying: " + queryErr.message
          );
          return res.status(500).json({ error: "Failed to sign in." });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "User Not Found." });
        }

        const user = results[0];
        if (user.password !== password) {
          return res.status(401).json({ error: "Wrong Password." });
        }

        const token = jwt.sign({ email }, secretKey);
        const type = "parent";
        console.log("Logined successfully");
        res.status(200).json({ user, token, type });
      });
    });
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Failed to sign in." });
  }
});

router.get("/get-students/:parentId", async (req, res) => {
  try {
    const parentId = req.params.parentId;
    const sql = "SELECT * FROM Student WHERE Parent_Id = ?";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to get MySQL connection: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to get database connection." });
      }

      connection.query(sql, [parentId], (queryErr, results) => {
        connection.release();

        if (queryErr) {
          console.error(
            "An error occurred while querying: " + queryErr.message
          );
          return res
            .status(500)
            .json({ error: "Students could not be fetched." });
        }

        res.status(200).json({ students: results });
      });
    });
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Students could not be fetched." });
  }
});
router.post("/add-student", async (req, res) => {
  try {
    const { name, password, graduation, niveau, parent_id } = req.body;
    const insertSql =
      "INSERT INTO Student (Name, Password, Graduation, Parent_Id) VALUES (?, ?, ?, ?)";
    const selectSql = "SELECT LAST_INSERT_ID() AS student_id";
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to get MySQL connection: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to get database connection." });
      }

      connection.beginTransaction((transactionErr) => {
        if (transactionErr) {
          console.error(
            "An error starting the transaction: " + transactionErr.message
          );
          return res
            .status(500)
            .json({ error: "Failed to initiate transaction." });
        }

        connection.query(
          insertSql,
          [name, password, graduation, parent_id],
          (queryErr, results) => {
            if (queryErr) {
              connection.rollback(() => {
                console.error(
                  "An error occurred while querying: " + queryErr.message
                );
                return res
                  .status(500)
                  .json({ error: "Failed to add a student." });
              });
            }

            connection.query(selectSql, (selectQueryErr, selectResults) => {
              if (selectQueryErr) {
                connection.rollback(() => {
                  console.error(
                    "An error occurred while querying: " +
                      selectQueryErr.message
                  );
                  return res
                    .status(500)
                    .json({ error: "Failed to add a student." });
                });
              }

              const student_id = selectResults[0].student_id;

              connection.commit((commitErr) => {
                if (commitErr) {
                  connection.rollback(() => {
                    console.error(
                      "Error committing transaction: " + commitErr.message
                    );
                    return res
                      .status(500)
                      .json({ error: "Failed to add a student." });
                  });
                }

                try {
                  let courses = [];
                  let yks = [];
                  const tyt = [
                    "Türkçe",
                    "Sosyal Bilimler",
                    "Matematik",
                    "Fen Bilimleri",
                  ];
                  if (graduation === "LGS") {
                    courses = [
                      "Türkçe",
                      "Sosyal Bilgiler",
                      "Matematik",
                      "Fen Bilgisi",
                      "Yabancı Dil",
                      "Din Kültürü ve Ahlak Bilgisi",
                    ];
                  }

                  if (graduation === "YKS") {
                    if (niveau === "EA") {
                      yks = ["Türkçe II", "Matematik II"];
                    }
                    if (niveau === "SAY") {
                      yks = ["Matematik II", "Fen Bilimleri II"];
                    }
                    if (niveau === "SÖZ") {
                      yks = ["Türkçe II", "Sosyal Bilimler II"];
                    }
                    if (niveau === "DİL") {
                      yks = ["Yabancı Dil"];
                    }
                  }
                  courses = [...tyt, ...yks];
                  try {
                    const sql =
                      "INSERT INTO Courses (Name, Student_Id) VALUES (?, ?)";

                    pool.getConnection((err, connection) => {
                      if (err) {
                        console.error(
                          "Failed to get MySQL connection: " + err.message
                        );
                        return;
                      }

                      courses.forEach((course) => {
                        connection.query(
                          sql,
                          [course, student_id],
                          (queryErr, results) => {
                            if (queryErr) {
                              console.error(
                                "An error occurred while querying: " +
                                  queryErr.message
                              );
                            }
                          }
                        );
                      });

                      connection.release();
                    });
                  } catch (error) {
                    console.error(
                      "An unexpected error occurred: " + error.message
                    );
                  }
                } catch (error) {
                  console.log("Handle Course error:", error);
                }

                res.status(201).json({
                  message: "The stuned saved successfully",
                  student_id,
                });
              });
            });
          }
        );
      });
    });
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Failed to add a student." });
  }
});

router.delete("/delete-student/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    const sql = "DELETE FROM Student WHERE Id = ?";
    const sql2 = "DELETE FROM Courses WHERE Student_Id = ?";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to get MySQL connection: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to get database connection." });
      }

      connection.beginTransaction((transactionErr) => {
        if (transactionErr) {
          console.error(
            "An error starting the transaction: " + transactionErr.message
          );
          return res
            .status(500)
            .json({ error: "Failed to initiate transaction." });
        }

        connection.query(sql2, [studentId], (queryErr, results) => {
          if (queryErr) {
            connection.rollback(() => {
              console.error(
                "An error occurred while querying: " + queryErr.message
              );
              return res
                .status(500)
                .json({ error: "The courses could not be deleted." });
            });
          }

          if (results.affectedRows === 0) {
            connection.rollback(() => {
              return res
                .status(404)
                .json({ error: "Student course not found." });
            });
          }

          connection.query(sql, [studentId], (queryErr, results) => {
            if (queryErr) {
              connection.rollback(() => {
                console.error(
                  "An error occurred while querying: " + queryErr.message
                );
                return res
                  .status(500)
                  .json({ error: "The student could not be deleted." });
              });
            }

            if (results.affectedRows === 0) {
              connection.rollback(() => {
                return res.status(404).json({ error: "Student not found." });
              });
            }

            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  console.error(
                    "Error committing transaction: " + commitErr.message
                  );
                  return res
                    .status(500)
                    .json({ error: "The student could not be deleted." });
                });
              }

              res
                .status(200)
                .json({ message: "Student and courses successfully deleted." });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "The student could not be deleted." });
  }
});

module.exports = router;

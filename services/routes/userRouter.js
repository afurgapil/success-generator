/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const router = require("express").Router();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

// Bağlantı havuzu oluşturun
const pool = mysql.createPool({
  host: "localhost",
  user: "gapil",
  password: "Test1234",
  database: "mydb",
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const sql = "INSERT INTO Parent (e_mail, password) VALUES (?, ?)";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("MySQL bağlantısı alınamadı: " + err.message);
        return res
          .status(500)
          .json({ error: "Veritabanı bağlantısı alınamadı." });
      }

      connection.query(sql, [email, password], (queryErr, results) => {
        connection.release(); // Bağlantıyı geri bırak

        if (queryErr) {
          console.error("Kayıt eklenirken hata oluştu: " + queryErr.message);
          return res
            .status(500)
            .json({ error: "Kullanıcı kaydı gerçekleştirilemedi." });
        }
        const token = jwt.sign({ email }, "tauderindevlet");
        console.log("Yeni kayıt başarıyla eklendi.");
        res.status(201).json({ user: { email }, token });
      });
    });
  } catch (error) {
    console.error("Beklenmeyen bir hata oluştu: " + error.message);
    res.status(500).json({ error: "Kullanıcı kaydı gerçekleştirilemedi." });
  }
});
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const sql = "SELECT * FROM Parent WHERE e_mail = ?";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("MySQL bağlantısı alınamadı: " + err.message);
        return res
          .status(500)
          .json({ error: "Veritabanı bağlantısı alınamadı." });
      }

      connection.query(sql, [email], (queryErr, results) => {
        connection.release(); // Bağlantıyı geri bırak

        if (queryErr) {
          console.error("Sorgu yapılırken hata oluştu: " + queryErr.message);
          return res.status(500).json({ error: "Giriş yapılamadı." });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "User Not Found." });
        }

        const user = results[0];
        if (user.password !== password) {
          return res.status(401).json({ error: "Wrong Password." });
        }

        const token = jwt.sign({ email }, "tauderindevlet");
        const type = "parent";
        console.log("Giriş başarılı.");
        res.status(200).json({ user, token, type });
      });
    });
  } catch (error) {
    console.error("Beklenmeyen bir hata oluştu: " + error.message);
    res.status(500).json({ error: "Giriş yapılamadı." });
  }
});

//student

router.get("/get-students/:parentId", async (req, res) => {
  try {
    const parentId = req.params.parentId;
    const sql = "SELECT * FROM Student WHERE Parent_Id = ?";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("MySQL bağlantısı alınamadı: " + err.message);
        return res
          .status(500)
          .json({ error: "Veritabanı bağlantısı alınamadı." });
      }

      connection.query(sql, [parentId], (queryErr, results) => {
        connection.release(); // Bağlantıyı geri bırak

        if (queryErr) {
          console.error("Sorgu yapılırken hata oluştu: " + queryErr.message);
          return res.status(500).json({ error: "Öğrenciler getirilemedi." });
        }

        res.status(200).json({ students: results });
      });
    });
  } catch (error) {
    console.error("Beklenmeyen bir hata oluştu: " + error.message);
    res.status(500).json({ error: "Öğrenciler getirilemedi." });
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
        console.error("MySQL bağlantısı alınamadı: " + err.message);
        return res
          .status(500)
          .json({ error: "Veritabanı bağlantısı alınamadı." });
      }

      connection.beginTransaction((transactionErr) => {
        if (transactionErr) {
          console.error(
            "Transaction başlatılırken hata oluştu: " + transactionErr.message
          );
          return res.status(500).json({ error: "Transaction başlatılamadı." });
        }

        // Öğrenci ekleme sorgusu
        connection.query(
          insertSql,
          [name, password, graduation, parent_id],
          (queryErr, results) => {
            if (queryErr) {
              connection.rollback(() => {
                console.error(
                  "Sorgu yapılırken hata oluştu: " + queryErr.message
                );
                return res.status(500).json({ error: "Öğrenci eklenemedi." });
              });
            }

            // Eklenen öğrencinin ID'sini al
            connection.query(selectSql, (selectQueryErr, selectResults) => {
              if (selectQueryErr) {
                connection.rollback(() => {
                  console.error(
                    "Sorgu yapılırken hata oluştu: " + selectQueryErr.message
                  );
                  return res.status(500).json({ error: "Öğrenci eklenemedi." });
                });
              }

              const student_id = selectResults[0].student_id;

              connection.commit((commitErr) => {
                if (commitErr) {
                  connection.rollback(() => {
                    console.error(
                      "Transaction commit edilirken hata oluştu: " +
                        commitErr.message
                    );
                    return res
                      .status(500)
                      .json({ error: "Öğrenci eklenemedi." });
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
                          "MySQL bağlantısı alınamadı: " + err.message
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
                                "Sorgu yapılırken hata oluştu: " +
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
                      "Beklenmeyen bir hata oluştu: " + error.message
                    );
                  }
                } catch (error) {
                  console.log("Handle Course error:", error);
                }

                res
                  .status(201)
                  .json({ message: "Öğrenci başarıyla eklendi.", student_id });
              });
            });
          }
        );
      });
    });
  } catch (error) {
    console.error("Beklenmeyen bir hata oluştu: " + error.message);
    res.status(500).json({ error: "Öğrenci eklenemedi." });
  }
});

router.delete("/delete-student/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    const sql = "DELETE FROM Student WHERE Id = ?";
    const sql2 = "DELETE FROM Courses WHERE Student_Id = ?";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("MySQL bağlantısı alınamadı: " + err.message);
        return res
          .status(500)
          .json({ error: "Veritabanı bağlantısı alınamadı." });
      }

      connection.beginTransaction((transactionErr) => {
        if (transactionErr) {
          console.error(
            "Transaction başlatılırken hata oluştu: " + transactionErr.message
          );
          return res.status(500).json({ error: "Transaction başlatılamadı." });
        }

        connection.query(sql2, [studentId], (queryErr, results) => {
          if (queryErr) {
            connection.rollback(() => {
              console.error(
                "Sorgu yapılırken hata oluştu: " + queryErr.message
              );
              return res.status(500).json({ error: "Dersler silinemedi." });
            });
          }

          if (results.affectedRows === 0) {
            connection.rollback(() => {
              return res
                .status(404)
                .json({ error: "Öğrenci dersi bulunamadı." });
            });
          }

          connection.query(sql, [studentId], (queryErr, results) => {
            if (queryErr) {
              connection.rollback(() => {
                console.error(
                  "Sorgu yapılırken hata oluştu: " + queryErr.message
                );
                return res.status(500).json({ error: "Öğrenci silinemedi." });
              });
            }

            if (results.affectedRows === 0) {
              connection.rollback(() => {
                return res.status(404).json({ error: "Öğrenci bulunamadı." });
              });
            }

            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  console.error(
                    "Transaction commit edilirken hata oluştu: " +
                      commitErr.message
                  );
                  return res.status(500).json({ error: "Öğrenci silinemedi." });
                });
              }

              res
                .status(200)
                .json({ message: "Öğrenci ve dersleri başarıyla silindi." });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Beklenmeyen bir hata oluştu: " + error.message);
    res.status(500).json({ error: "Öğrenci silinemedi." });
  }
});

module.exports = router;

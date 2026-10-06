const connection = require("../database/mysql.database");

module.exports = {
    Dashboard:(req,res)=>{

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM students) AS totalStudents,
            (SELECT COUNT(*) FROM courses) AS totalCourses,
            (SELECT COUNT(*)
             FROM attendance
             WHERE attendance_date = CURDATE()
             AND status = 'Present') AS todayPresent,
            (SELECT COUNT(*)
             FROM attendance
             WHERE attendance_date = CURDATE()
             AND status = 'Absent') AS todayAbsent
    `;

    connection.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message
            });
        }

        return res.status(200).json({
            error: false,
            data: result[0]
        });
    });
    }
}
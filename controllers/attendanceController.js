const connection = require("../database/mysql.database");
const { validationResult } = require("express-validator");

module.exports = {
    markAttendance: (req,res)=>{
        const {student_id, attendance_date, status} = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
         connection.query(
            `INSERT INTO attendance
            (student_id, attendance_date, status)
            VALUES (?, ?, ?)`,
            [student_id, attendance_date, status],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        error: true,
                        message: err.message
                    });
                }

                return res.status(201).json({
                    error: false,
                    message: "Attendance marked successfully",
                    attendanceId: result.insertId
                });
            }
        )
    },

     bulkAttendance: (req, res) => {
        const { attendance_date } = req.body;

        if (!attendance_date) {
            return res.status(400).json({
                error: true,
                message: "Attendance date is required"
            });
        }

        connection.query(`
            INSERT INTO attendance
            (student_id, attendance_date, status)
            SELECT id, ?, 'Present'
            FROM students
        `, [attendance_date], (err, result) => { //INSERT...SELECT query that takes data from students and inserts it into attendance
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: err.message
                });
            }

            return res.status(201).json({
                error: false,
                message: "Attendance marked for all students",
                totalStudents: result.affectedRows
            });
        });
    },

    getAttendanceByRoll: (req,res)=>{
        const roll_no = req.params.roll_no;
        connection.query(`select attendance.id, students.name, attendance.attendance_date, 
        attendance.status from attendance join students on attendance.student_id = students.id where students.roll_no = ?`,
        [roll_no], (err, result)=>{
            if(err){
                return res.send({error: true, message: err.message});
            }
            if(result.length === 0){
                return res.send({
                    error: true,
                    message: "roll number not exists"
                });
            }
            return res.send({error: false,message: "Attendance fetched successfully", data: result});
        })
    }
};

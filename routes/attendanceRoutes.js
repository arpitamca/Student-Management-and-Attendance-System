const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const attendanceController =
    require("../controllers/attendanceController");

router.post(
    "/",
    [
        body("student_id")
            .notEmpty()
            .withMessage("Student ID is required")
            .isInt()
            .withMessage("Student ID must be a number"),

        body("attendance_date")
            .notEmpty()
            .withMessage("Attendance date is required")
            .isISO8601()
            .withMessage("Invalid date"),

        body("status")
            .notEmpty()
            .withMessage("Attendance status is required")
            .isIn(["Present", "Absent"])
            .withMessage("Status must be Present or Absent")
    ],
    attendanceController.markAttendance
);

router.post("/bulk", attendanceController.bulkAttendance);

router.get("/student/:roll_no",attendanceController.getAttendanceByRoll);

module.exports = router;
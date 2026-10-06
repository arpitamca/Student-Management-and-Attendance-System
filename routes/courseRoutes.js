var express = require('express');
var router = express.Router();
const coursesController = require("../controllers/coursesController");
const {body, param} = require("express-validator");

router.post("/",[
    body("course_name")
    .trim()
    .notEmpty()
    .withMessage("course name is required")
    .bail()
    .matches(/^[A-Za-z ]+$/)
    .withMessage("course name should be in char only"),
    body("course_code")
    .trim()
    .notEmpty()
    .withMessage("course code is required")
    .bail()
    .matches(/^[A-Za-z]{2}[0-9]{3}$/)
    .withMessage('course code must contain 2 letters followed by 3 numbers')
],coursesController.addCourse);

router.get("/",coursesController.getCourses);

module.exports = router;
var express = require('express');
var router = express.Router();
const studentsController = require('../controllers/studentsController');
const{body, param}= require('express-validator');

router.post('/',[        //Use the exact path that was already provided by app.js.
    body("name")
        .trim()
        .notEmpty()
        .withMessage("name is required")
        .bail()
        .matches(/^[A-Za-z ]+$/)
        .withMessage("name should be in char only"),
    body("roll_no")
        .trim()
        .notEmpty()
        .withMessage("name is required")
        .bail()
        .isLength({min: 3, max: 3})  
        .withMessage("must contain exactly 3 numbers"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .bail()
        .isEmail()
        .withMessage("invalid email"),
    body("phone")
        .trim()
        .notEmpty()
        .withMessage("phone number is required")
        .bail()
        .isMobilePhone("en-IN")
        .withMessage("please enter a valid mobile number"),
    body("semester")   
        .trim()
        .notEmpty()
        .withMessage("semester is required")          
], studentsController.addStudent);

router.get('/', studentsController.getAllStudents);

router.get('/:roll_no', studentsController.getStudentById);

router.put('/:roll_no',[
    param("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .bail()
        .isEmail()
        .withMessage("invalid email"),
    param("phone")
        .trim()
        .notEmpty()
        .withMessage("phone number is required")
        .bail()
        .isMobilePhone("en-IN")
        .withMessage("please enter a valid mobile number"),
    param("semester")   
        .trim()
        .notEmpty()
        .withMessage("semester is required")          
], studentsController.updateStudent);

router.delete('/:roll_no',param("roll_no")
        .trim()
        .notEmpty()
        .withMessage("name is required")
        .bail()
        .isLength({min: 3, max: 3})  
        .withMessage("roll number must contain exactly 3 numbers"), 
studentsController.deleteStudent);

module.exports = router;
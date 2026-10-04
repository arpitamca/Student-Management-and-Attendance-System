var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const {body} = require("express-validator");

router.post('/register',[
    body("username")
        .trim()
        .notEmpty()
        .withMessage("username is required")
        .bail()
        .matches(/^[A-Za-z]+$/)
        .withMessage("name should be in char only"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .bail()
        .isEmail()
        .withMessage("invalid email"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required")
        .bail()
        .isLength({min:8, max:12})
        .withMessage("password must contain min 8 and max 12 char")]
,authController.registerAdmin);

router.post('/login',[
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .bail()
        .isEmail()
        .withMessage("invalid email"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required")
        .bail()
        .isLength({min:8, max:12})
        .withMessage("password must contain min 8 and max 12 char")],
authController.loginAdmin);

module.exports = router;
const connection = require("../database/mysql.database");
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');

module.exports= {
    registerAdmin:async(req,res)=>{
        let result = validationResult(req);
        if(!result.isEmpty()){
            return res.status(400).json({
                errors: result.array()
            });
        }
        const{username, email, password} = req.body;
        connection.query('Select * from users where email = ?', [email], async(err, result)=>{
        if(err){
            res.send({error: true, message: err.message});   
        }
        if(result.length > 0){ //results.length > 0 → means the database query returned at least one record
            return res.status(400).json({
                error : true,
                message: 'User already exists with this Email'});
        }
        
        //Hash password
        const salt = bcrypt.genSaltSync(10); //salt is random data added to a password before hashing
        const hashedPassword = bcrypt.hashSync(password, salt);

        connection.query(`Insert into users(id, username, email, password) values (0,?,?,?)`,[username, email, hashedPassword],(err,result)=>{
            if(err){
                return res.send({error: true,message: err.message})
            }
            if(result.affectedRows>0){
                return res.send({error: false, message: "Registered Successfully"});
            }
        });
    });
    },

    loginAdmin: (req,res) => {
        const {email, password} = req.body;
        let result = validationResult(req);//Give me the validation errors that were recorded for this request
        if(!result.isEmpty()){
            return res.status(400).json({
                errors: result.array()
            });
        }
        connection.query(`Select * from users where email = ?`,[email], (err,result) => {
            if(err){
                res.send({error: true, message: err.message});
            }else{
                let isSame=bcrypt.compareSync(password, result[0].password);
                let token = jwt.sign({id:result[0].id, email:result[0].email}, 'secret',{algorithm:'HS256', expiresIn: '12h'});
                if(isSame){
                    res.send({error:false, message:"user logged in"});
                }else{
                    res.send("Login Failed");
                }
            }

        })
    }

}


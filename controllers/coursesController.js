const connection = require("../database/mysql.database");
const { validationResult } = require("express-validator");

module.exports = {
    addCourse: (req,res) =>{
        let {course_name,course_code} = req.body;
        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array()
            });
        }
        
        connection.query(`select course_name from courses where course_code = ?`,[course_code],(err, result)=>{
            if(err){
                res.send({error:true, message: err.message});
            }
            if(result.length>0){
                return res.send({error: true,
                message: "course already exists"
                })
            }
            connection.query(`insert into courses(id, course_name, course_code) values(0, ?, ?)`,
            [course_name, course_code], (err, result) =>{
                if (err) {
                    return res.send({ error: true, message: err.message });
                }
                if (result.affectedRows > 0) {
                    return res.send({ error: false, message: "course added" })
                }
            }
            )
        })
    },

    getCourses: (req,res)=>{
        connection.query(`select course_name, course_code from courses`,(err, result)=>{
            err?
                res.send({error: true, message: err.message}) :
                res.send({error: false, data: result})
        })
    }
}
const connection = require("../database/mysql.database");
const { validationResult } = require("express-validator");

module.exports = {
    validate:(req,res)=>{
        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array()
            });
        }
    },
    
    addStudent: (req, res) => {
        let { name, roll_no, email, phone, semester } = req.body;
        //let result = validationResult(req);
        //if (!result.isEmpty()) {
        //    return res.status(400).json({
        //        errors: result.array()
        //    });
        //}
        this.validate(req,res);
        
        connection.query(`Select * from students where roll_no = ?`, [roll_no], (err, result) => {
            if (err) {
                return res.send({ error: true, message: err.message });
            }
            if (result.length > 0) { //results.length > 0 → means the database query returned at least one record
                return res.status(400).json({
                    error: true,
                    message: 'roll number already exists'
                });
            }
            
            connection.query(`insert into students(id, name, roll_no, email, phone, semester)
            values (0, ?, ?, ?, ?, ?)`, [name, roll_no, email, phone, semester], (err, result) => {
                if (err) {
                    return res.send({ error: true, message: err.message });
                }
                if (result.affectedRows > 0) {
                    return res.send({ error: false, message: "student added" })
                }

        })
        })
    },

    getAllStudents: (req, res)=>{
        connection.query(`select name, roll_no, email, phone, semester from students`,(err, result)=>{
            err?
                res.send({error: true, message: err.message}) :
                res.send({error: false, data: result})
        })
    },

    getStudentById: (req,res)=>{
        const roll_no = req.params.roll_no;
        connection.query(`select name, email, phone, semester from students where roll_no = ?`,[roll_no], (err, result)=>{
            if (err) {
                return res.send({ error: true, message: err.message });
            }    
            if (result.length === 0) {
                return res.status(404).send({
                    error: true,
                    message: "roll number not exists"
                });
            }
                res.send({error: false, data: result});
            
        })
    },

    updateStudent: (req,res)=>{
        const roll_no = req.params.roll_no;
        let {email, phone, semester} = req.body;
        connection.query(`update students set email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        semester = COALESCE(?, semester) where roll_no = ?`,
            [email, phone, semester, roll_no],(err, result)=>{ //COALESCE(new_value, old_value) means "use the new value if it exists; otherwise keep the old value."
                if(err){
                    res.send({error: true, message: err.message});
                }
                if (result.length === 0) { //if the user gives a wrong/non-existing roll number, "student not found" response will be triggered.
                return res.status(404).send({
                    error: true,
                    message: "student not found"
                });
            }
        connection.query(`select name, email, phone, semester from students where roll_no = ?`,[roll_no], (err, result)=>{
            if(err){
                res.send({error: true, message: err.message});
            } 
            return res.status(400).json({
                error: false,
                message: 'student updated successfully',
                result: result[0]
            });
        });  
        });  
    },

    deleteStudent: (req, res)=>{
        const roll_no = req.params.roll_no;
        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array()
            });
        }

        connection.query(`delete from students where roll_no = ?`,[roll_no],(err,result)=>{
            if(err){
                res.send({error: true, message: err.message});
            }
            if(result.affectedRows === 0){
                res.send({
                error: true,
                message: "roll number not exist"
                })
            }else{
                res.send({message : 'user deleted successfully'});
            }
        })
    }
}
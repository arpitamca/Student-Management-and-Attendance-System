var jwt = require('jsonwebtoken');

module.exports = {
    checkedToken: (req, res, next) => {
        let token = req.headers.token;

        if(token){
            jwt.verify(token, 'secret', (err, decoded) =>{ //decoded → contains the data that was stored inside the JWT when you created it.
                if(err){
                    res.send({error: true, message: "unauthorized user"})
                }else{
                    req.user = decoded;
                    next();
                }
            })
        }else{
            res.send({error: trur, message:"token not provided"});
        }
    }

}
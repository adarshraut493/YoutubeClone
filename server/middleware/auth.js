import jwt from 'jsonwebtoken'

const auth =(req,res,next)=>{
    try {
        // Extracting the token from the request headers:
        const token = req.headers.authorization.split(" ")[1];

        let decodeData= jwt.verify(token,process.env.JWT_SECRET)
         req.userId=decodeData?.id
        next();
    }catch(error){
        res.status(400).json("Invalid Creadentials");
    }
}
export default auth
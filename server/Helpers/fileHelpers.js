import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      //date and time format
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const filefilter=(req,file,cb)=>{
    if(file.mimetype === "video/mp4"){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const upload = multer({storage:storage,fileFilter:filefilter});

export default upload

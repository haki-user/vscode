 const express = require('express');

 const multer = require('multer')

 const tesseract = require("node-tesseract-ocr")

 const path = require('path')

 const app = express();

 app.use(express.static(path.join(__dirname + '/uploads')))
 app.use(express.static("public"))

//  app.use(express.static(path.join(__dirname + '/uploads')))

  var storage = multer.diskStorage({
     destination: function(req,file,cb){
         cb(null,"uploads");
     },
     filename: function(req,file,cb){
         cb(
             null,
             file.fieldname + "-" + Date.now() + path.extname(file.originalname)
         );
     },
 });

 const upload = multer({storage:storage})

 app.set('view engine',"ejs");
 
 app.get('/',(req,res)=>{
    res.render('index',{data:''});
});

app.post('/extracttextfromimage', upload.single('file'),(req,res)=>{
    console.log(req.file.path)

    const config = {
        lang: "eng",
        oem: 1,
        psm: 3,
      }
      
      tesseract
        .recognize(req.file.path, config)
        .then((text) => {
          console.log("Result:", text);

          res.render('index', {data:text});
        })
        .catch((error) => {
          console.log(error.message)
        })
});


 app.listen(5000,()=>{
     console.log("App is listening on port 5000");
 });
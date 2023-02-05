var Express = require("express");
var Mongoose = require("mongoose");
var Bodyparser = require("body-parser");
var Cors = require("cors");
var {Employeemodel} = require("./models/Employeemodel")
var bcrypt = import("bcrypt");
var jwt = import("jsonwebtoken");
const path = require("path");

const app = new Express;
app.use(Express.static(path.join(__dirname,"/build")));
app.use(Cors());
app.use(Bodyparser.json());
app.use(Bodyparser.urlencoded({extended:true}));

Mongoose.connect("mongodb+srv://abdulazeem:abdulazeem86@cluster0.qch7vjx.mongodb.net/EmployeeDB?retryWrites=true&w=majority",{useNewUrlParser:true});



//Api to add employees
app.post("/api/addemployee", (req, res) => {
    var data = {
        name: req.body.name,
        emailId: req.body.emailId,
        password: req.body.password,
        location: req.body.location,
        position: req.body.position,
        salary: req.body.salary
    }

    var employee = new Employeemodel(data);
    employee.save((err, data) => {
        if (err) {
            res.json({ "Status": "Error", "Error": err })
        } else {
            res.json({ "Status": "Submitted successfully", "Data": data })
            console.log(employee);
        }
    })
});



//Api to view all employees
app.get("/api/employeelist", (req, res) => {

    Employeemodel.find(
        (err, data) => {
            if (err) {
                res.json({ "Status": "Error", "Error": err })
            } else {
                res.json(data);
            }
        })
});



//Api to update an employee
app.put("/api/update",(req,res)=>{
    
    var update = req.body.name;
    var data = req.body;

    Employeemodel.findOneAndUpdate({"name":update},data,(err,data)=>{
        if (err) {
            res.json({"Status":"Error","Error":err})
        } else {
            res.json({"Status":"Updated successfully", "Data":data})
        }
    })
});



//Api to delete an employee
app.delete("/api/delete/:id",(req,res)=>{

    var id = req.params.id;
    var data = req.body;
    Employeemodel.findByIdAndDelete({"_id":id},data,(err,data)=>{
        if (err) {
            res.json({"Status":"Error","Error":err})
        } else {
            res.json({"Status":"Success","Data":data})   
        }
    })
});


//Api to Signin
app.post("/api/signin", async(req,res)=>{
   
    await Employeemodel.find(
        {$and:[{"emailId":req.body.emailId, "password":req.body.password}]}
    )
    .then(
        (data)=>{
            console.log(data)
            res.send(data)
        }
    )
    .catch((error)=>{
        res.status(500).send(error);
      })
    })

//Delete api
app.delete("/api/deleteemployee/:id", (req,res)=>{
    Employeemodel.deleteOne({"_id":req.params.id})
    .then(
        (data)=>{
            console.log(data)
            res.send(data)
        })
    .catch((error)=>{
        res.status(500).send(error);
      })
    })

//Retrieve data api
app.get("/api/updateemployee/:id", (req,res)=>{
        Employeemodel.findOne({_id:req.params.id})
        .then(
            (data)=>{
                console.log(data)
                res.send(data)
            })
        .catch((error)=>{
            res.status(500).send(error);
        })
    })


//Update data api
  app.post("/api/updateemployee/:id",(req,res)=>{
    var id = req.params.id;    
    var data = req.body;
    Employeemodel.findByIdAndUpdate({_id: id},data,(err,data)=>{
            if (err) {
                res.json({"Status":"Error","Error":err})
            } else {
                res.json({"Status":"Success","Data":data});
            }
        }
    )
});

  

app.listen(3001,(err)=>{
    if(err){
        console.log("server crashed")
    }
    else{
        console.log("server started")
    }
})

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});
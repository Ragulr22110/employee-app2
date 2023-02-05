const Mongoose = require("mongoose")

const employeeSchema = Mongoose.Schema({
    name:String,
    emailId:String,
    password:String,
    location:String,
    position:String,
    salary:String 
})



const Employeemodel = Mongoose.model("Employees",employeeSchema);
module.exports = {Employeemodel};


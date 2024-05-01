const port=4000;
const express= require('express');
const app=express();
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const path=require("path");
const cors=require("cors");


app.use(express.json());

app.use(cors());

mongoose.connect("mongodb+srv://admin:admin@cluster0.ehjiksk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

const Users= mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})
//Creating end-point for registering User

app.post('/signup',async(req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"Existing User Found with same email id"})
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
    })
    await user.save();
    
    const data={
        user:{
            id:user.id
        }
    }
      const token= jwt.sign(data,'secret_ecom');
      res.json({success:true,token})
})

//creating end-point for UserLogin
app.post('/login',async(req,res)=>{
    let user= await Users.findOne({email:req.body.email});
    if(user)
    {
        const passCompare = req.body.password === user.password;
          if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token= jwt.sign(data,'secret_ecom')
            res.json({success:true,token});
          }
          else{
            res.json({success:false,errors:"Wrong Password"});
          }
    }
    else{
        res.json({success:false,errors:"Email Not Registered or Wrong Email id"})
    }
})

app.listen(port,(error)=>{
    if(!error)
    {
        console.log("Server Running on Port "+port);
    }
    else{
        console.log("Error:"+error);
    }
    })
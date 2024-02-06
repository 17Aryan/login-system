const express=require('express');
const mysql=require("mysql")
const dotenv=require('dotenv')

const app=express();
dotenv.config({path: './.env'})

const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_ROOT,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
})

db.connect((error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("MySQL connected!")
    }
})

app.set('view engine','hbs')

const path=require("path")
const publicDir=path.join(__dirname,'./public')
app.use(express.static(publicDir))
app.get("/",(req,res)=>{
    res.render("index")
})
app.listen(5000,()=>{
    console.log("Server strted at port 5000")
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.get("/login",(req,res)=>{
    res.render("login")
})

// path for /auth/register

const bcrypt=require("bcryptjs")
app.use(express.urlencoded({encoded:'false'}))
app.use(express.json())

app.post("/auth/register",(req,res)=>{
    const{name, email, password, password_confirm}=req.body
    
    db.query('SELECT email FROM users WHERE email=?',[email],async(error,ress)=>{
        if(error){
            console.log(error)
        }
        if(result.length>0){
            return res.render('register',{
                message:'This email already exists!'
            })
        }
        else if(password!==password_confirm){
            return res.render('register',{
                message:'Password Incorrect!'
            })
        }
        let hashedpassword=await bcrypt.hash(password,8)
        db.query('INSERT INTO users SET?',{name:name, email:email, password:hashedpassword},(err,res)=>{
            if(error){
                console.log(error)
            }
            else{
                return res.render('register',{
                    message:'Successfully registered!'
                })
            }
        })
    })
})
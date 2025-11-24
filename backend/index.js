const port=4000;
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
const { type } = require("os");

app.use(express.json());
app.use(cors());
//Databse connection with mongodb
mongoose.connect("mongodb+srv://abditech:12345@cluster0.ftytfzp.mongodb.net/Ecommerce");
// Api creation
app.get("/",(req,res)=>{
    res.send("Express app is running");
})
const storage=multer.diskStorage({
 destination:'./upload/images',
 filename:(req,file,cb)=>{
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
 }
})
const upload=multer({storage:storage})
// creating upload endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})
//schema for creating products
const Product=mongoose.model("Product",{
   id:{
    type:Number,
    required:true,
   },
   name:{
    type:String,
    required:true,
   },
   image:{
    type:String,
    required:true,
   },
   category:{
    type:String,
    required:true,
   },
   new_price:{
    type:Number,
    required:true,
   },
   old_price:{
    type:Number,
    required:true,
   },
   date:{
    type:Date,
    default:Date.now,
   },
   available:{
    type:Boolean,
    default:true,
   },
})
app.post('/addproduct',async(req,res)=>{
    let Products=await Product.find({});
    let id;
    if(Products.length>0){
        let last_product_array=Products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;

    }
    const newProduct=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(newProduct);
    await newProduct.save();
    console.log("saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})
// creating api for removing produts
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed");
    res.json({
        success:true,
        name:req.body.name
    })
})
//creating API for getting  and displaying all products
app.get('/allproducts',async(req,res)=>{
    let Products=await Product.find({});
    console.log("All products are fetched");
    res.send(Products);
})
// schema creating for user mode
const User=mongoose.model('Users',{
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
//creating an endpoint for user registration
app.post('/signup',async(req,res)=>{
    let check= await User.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email adress"})
    }
    let cart={};
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user=new User({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();
    const data={
        user:{
            id:user.id
        }
    }
    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})
// creating endpoint for the user login
app.post('/login',async(req,res)=>{
  let user=await User.findOne({email:req.body.email});
  if(user){
    const passCompare=req.body.password===user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom')
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"wrong password"});
        }

  }
  else{
    res.json({success:false,errors:"wrong email"})
  }
})
// creating an endpoint for newcollection  data
app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});

    let newcollection=products.slice(1).slice(-8);
    console.log("NewCollection fetched");
    res.send(newcollection);
})
// creating an end point for popular in women section
app.get('/popularinwomen',async(req,res)=>{
 let products=await Product.find({category:"women"});
 let popular_in_women=products.slice(0,4);
 console.log('popular in women fetched');
 res.send(popular_in_women);
})
// creating middleware to fetch user
const fetchUser=async (req,res,next)=>{
  const token=req.header('auth-token');
  if(!token){
    res.status(401).send({errors:"please autheiticate using valid token"})
  }
  else{
    try{
  const data=jwt.verify(token,'secret_ecom');
  req.user=data.user;
  next();
    }
    catch(error){
  res.status(401).send({errors:"please authenticate by using a valid token"})
    }
  }
}
//creating an end point for adding products in the cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
     console.log("added",req.body,itemId);
   let userData=await User.findOne({_id:req.user.id});
   userData.cartData[req.body.itemId] +=1;
   await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
   res.send("Added");
})
// creating endpoint to remove  products from the cart data
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body,itemId);
 let userData=awaitUser.findOne({_id:req.user.id});
 if( userData.cartData[req.body.itemId])
   userData.cartData[req.body.itemId] -=1;
   await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
   res.send("Removed");
})
//creating an end point to get the cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
console.log("Get cart");
let userData=await User.findOne({_id:req.user.id});
res.json(userData.cartData);
})
app.listen(port,(error)=>{
    if(!error){
        console.log("server running on port "+port);
    }
    else{
        console.log("Error: "+error)
    }
})
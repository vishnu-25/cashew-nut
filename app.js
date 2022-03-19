const express = require("express");
const app = express();
const mongoose=require("mongoose")


app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))

var tot=0;
app.use(express.static("public"))
var tools = require('./function');
 tools.foo();

 var wType;
 var wWeight;
 var wQuantity;
 var wtotal;
 var wPrice;


mongoose.connect("mongodb://localhost:27017/cashewnut",{ useNewUrlParser: true , useUnifiedTopology: true})
const McartSchema=new mongoose.Schema({
    type:String,
    subtype:String,
    weight:String,
    quantity:Number,
    price:Number,
    total:Number
   
})
const mcart = new mongoose.model("mcart",McartSchema);
const customerDetails=new mongoose.Schema({
    
})
const CustomerDetails = new mongoose.model("details",customerDetails);

app.get("/",function(req,res){
    res.render("index2");
})
app.get("/toc",function(request,response)
{
    response.render("toc")
})
app.get("/store",function(request,response)
{
    response.render("store",{message:""})
})
app.get("/signup",function(request,response)
{
    response.render("sign up")
})
app.get("/aboutus",function(request,response)
{
    response.render("aboutus")
})
app.get("/democart",function(request,response)
{
    response.render("democart")
})
app.get("/cart",function(request,response)
{
    tot=0,c=0;
    mcart.find({},function(e,found){
        if(!e)
        { 
            found.forEach((val)=>{
                tot=tot+val.price;
                c++;
            })
            response.render("cart",{sno:1,found:found,tot:tot,c:c});
        }
    })
   
    
})
app.post("/cart",function(req,res){
    tot=0;
    console.log(req.body);
    quantity=req.body.quantity;
    price=req.body.subType;
    mcart.findOne({type:req.body.typename},(err,product)=>{
        if(product){
            product.quantity=+product.quantity+ +req.body.quantity;
            product.save(function(e)
            {
                if(e)
                {
                    console.log("Error at save the form");
                }
                else
                {
                 mcart.find({},function(e,found){
                     if(!e)
                     { 
                         found.forEach((val)=>{
                             tot=tot+val.amount;
                         })
                        //  res.render("cart",{sno:1,found:found,tot:tot});
                        res.render("store",{message:"success"});
                     }
                 })
                }
            })
        }else{
            const Mcart= new mcart({
                type:req.body.typename,
                weight:req.body.weight,
                quantity:quantity,
                price:price*quantity,
                total:price
                // res.render("cart",{type:type,subType:subType,weight:weight,amount:amount})
            })
        Mcart.save(function(e)
           {
               if(e)
               {
                   console.log("Error at save the form");
               }
               else
               {
                mcart.find({},function(e,found){
                    if(!e)
                    { 
                        found.forEach((val)=>{
                            tot=tot+val.price;
                        })
                        // res.render("cart",{sno:1,found:found,tot:tot});
                        res.render("store",{message:"success"});
                    }
                })
               }
           })
        }
    })

      
})
app.post("/delete_product",function(req,res){
    wType = req.body.type;
    wWeight = req.body.weight;
    wQuantity = req.body.quantity;
    wTotal = req.body.total;
    wPrice = req.body.price;
    var type = req.body.type;
    mcart.deleteOne({type : type},function(e){
        if(e)
        {
            console.log("Error at deletion");
        }
        else{
            res.redirect("/cart");
        }
    })
})
app.get("/details",function(req,res){
    customerName = req.body.customerName;
    customerPh = req.body.customerPh;
    customerAddress = req.body.customerAddress;
})
app.get("/admin",function(req,res)
{
    res.render("admin");
})
app.listen(8000,function(){
    console.log("running in port 8000");
})
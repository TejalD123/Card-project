const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path=require("path");
const Chat = require('./models/chat.js');
const methodOverride=require("method-override");

app.use(methodOverride("_method"));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));


main().then(()=>{
    console.log("Connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

app.get('/chats/new',(req,res)=>{
    res.render("newchat.ejs");
})



//index route

app.get('/chats',async (req,res)=>{
   let chats= await Chat.find({});
   res.render("chats.ejs",{chats});
})


app.get('/',(req,res)=>{
    res.send("welcome");
})

//create route
app.post('/chats',(req,res)=>{
    let {from,to,msg}=req.body;
    let newChat=new Chat({
        from:from,
        msg:msg,
        to:to,
        created_at:new Date(),
    });
    newChat
    .save()
    .then(()=>{
        console.log("Chat was save")
    })
    .catch((err)=>{
        console.log(err);
    })
    res.redirect('/chats');
});

app.get('/chats/:id/edit',async (req,res)=>{
    let {id}=req.params;
    let chat= await Chat.findById(id);
    res.render("edit.ejs",{chat});
});

app.put('/chats/:id',async (req,res)=>{
    let {id} =req.params;
    let {msg:newmsg} = req.body;
    let updatedChat= await Chat.findByIdAndUpdate(id,{msg:newmsg},{runValidators:true, new:true});
    console.log(updatedChat);
    res.redirect("/chats");
})

app.delete("/chats/:id",async(req,res)=>{
    let {id} = req.params;
    let DeletedChat =  await Chat.findByIdAndDelete(id);
    console.log(DeletedChat);
    res.redirect("/chats");

})

app.listen(3000,()=>{
    console.log("app is listening")
})
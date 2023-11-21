const express = require("express");
const bodyparser = require("body-parser");
const  request =require("request");
const  https =require("https");


require('dotenv').config({path : 'vars/.env'});
const MAPI_KEY = process.env.API_KEY
const MLIST_ID = process.env.LIST_ID
const MAPI_SERVER = process.env.API_SERVER

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/",function(req ,res){

    const fname = req.body.firstName;
    const lname = req.body.secondName;
    const mail = req.body.email;
   
    const data = {
        members: [
            {
                email_address:mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
   const url = "https://" + MAPI_SERVER +".api.mailchimp.com/3.0/lists/" +MLIST_ID;
    const Options = {
        method: "POST",
        auth: "ajit1:" +MAPI_KEY
    };

 const request =  https.request(url, Options, function(respnse){

    if(respnse.statusCode === 200){
        res.sendFile(__dirname +"/succes.html");
    }
    else{
        res.sendFile(__dirname +"/fail.html");
    }
respnse.on("data",function(data){
    console.log(JSON.parse(data));
})
})

request.write(jsonData);
request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/")
})
app.listen(port, function(req ,res){
    console.log("Listening on port "+port);
})



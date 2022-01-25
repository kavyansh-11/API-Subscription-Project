const express=require('express');
const bodyParser=require('body-parser');
const request=require('request');
const https=require('https');
const { post } = require('request');
const app=express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post('/',function(req,res){
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;

    let data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname,
                }
            }
        ]
    };
    const parseData=JSON.stringify(data);
    console.log(parseData);

    const Option={
        method:'POST',
        auth:'kavyansh:0e2ada9db01d6db6b0583053e08cebc2-us20'
    };

    const url="https://us20.api.mailchimp.com/3.0/lists/4e7c7e35e3";
    
    const requests=https.request(url,Option,function(resp){
        if(resp.statusCode===200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else
        {
            res.sendFile(__dirname + "/failure.html");
        }

        resp.on('data',function(data){
            console.log(JSON.parse(data));
        })
    })
    requests.write(parseData);
    requests.end();
})

app.post('/failure',function(req,res){
    console.log("try again");
    res.redirect('/');
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running");
});

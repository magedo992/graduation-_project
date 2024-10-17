const nodemailer=require('nodemailer');
const sendEmail=(option)=>{
    const transport=nodemailer.createTransport({
        service:"Gmail",
        host:"smtp.gmail.com",
        port:587,
        auth:{
            user:process.env.Email,
            pass:process.env.Pass
        }
    });
    transport.sendMail(option,(err,info)=>{
        if(err)
        {
            return console.log(err);
            
        }
        console.log("Email send",info.response);
        
    })
}

module.exports={sendEmail};
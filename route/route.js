'use strict';

require('dotenv').config();
const nodemailer = require('nodemailer');
const axios = require('axios')
const headersWebPush = { 'Authorization': process.env.WEBPUSH_AUTHORIZATION,
    'Content-Type': 'application/json' };
const express = require('express');
const router = express.Router();
const smtpTransport = require('nodemailer-smtp-transport');

// route to connect telegram notification service
router.post('/telegram', (req, res, next) => {
    const data  = req.body.body;
    console.log(data)
    sendHttpNotificationTelegramGroup(data);
});
// route to connect web push notification service
router.post('/webpush', (req, res, next) => {
    const { data } = req.body;
    
    sendNotificationToDeviceBYWebPush(data).catch(console.error);;
});
// route to connect to gmail service
router.post('/gmail', (req, res, next) => {
    const { data } = req.body;
    sendEmailByGmail().catch(console.error);;
});

module.exports = router;

// send message to telegram group
async function sendHttpNotificationTelegramGroup(data) {
    const messages = data;
    console.log(data)
    axios.post('https://api.telegram.org/' + process.env.TELEGRAM_AUTHORIZATION + '/sendMessage?chat_id=-456312332&text=' +
    messages, '').then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res.data)
      })
      .catch(error => {
        console.error(error)
      });
  }

// send web push notifiactoin
async function sendNotificationToDeviceBYWebPush(data) {
    // body of notification
    const messages =  {
      'notification': {
           'title': 'Miam!',
           'body': data.body,
           'click_action': 'http://miambf.com',
           'icon': 'https://firebasestorage.googleapis.com/v0/b/flutterfoodapp-aa0df.appspot.com/o/logos%2Fmiam1-min.png?alt=media&token=9ebe4ebf-ff1e-461e-ae40-b3e0294e7bd6',
           'sound' : '../../../assets/audio/Alarm.mp3'
       },

       'to': 'fa2RC2ktfAvJ-RQOAgeyxj:APA91bHQ9xdXggOWrQZVQ2tEaIQXfhZ7t8lAmtswKYpW0rarPz7vx8zFX3ewWpXPjggKWfw3d9hPVL0p43qn-MfvkboMKz2ZC6ovBALNGtuMHYWFyWlFYG1QbJaM_x_Ifk64WB20GOdu'
    };
    
    const body = messages;


    axios.post('https://fcm.googleapis.com/fcm/send', 
       body,
        {headers: headersWebPush }).then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res.data)
      })
      .catch(error => {
        console.error(error)
      });
  };

// async..await is not allowed in global scope, must use a wrapper
async function sendEmailByGmail() {
    // Generate test SMTP service account from ethereal.email
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: 'smtp.gmail.com',
    auth: {
          user: 'aroldrams@gmail.com',
          pass: 'A rams 37'
      },
    });
  
    // mail option
    var to = 'arnaudrams37@gmail.com';
    var from = 'aroldrams@gmail.com';
    let mailOption = {
        from: from, // sender address
        to: to, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
       // html: '<b>Hello world?</b>', // html body
    }
    // send mail with defined transport object
    let info = await transporter.sendMail({mailOption, function (err, data) {
            if(err) {
                console.log(err);
            }else {
                console.log('yoo ca passe');
                console.log(data);
            }
        }
    });
  
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
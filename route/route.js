'use strict';

const config = require('../config/config.js');
const axios = require('axios')
const headersWebPush = { 'Authorization': process.env.WEBPUSH_AUTHORIZATION,
    'Content-Type': 'application/json' };
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
var queueUrl = "https://sqs.us-east-1.amazonaws.com/073844720199/notify-order";
var isDev = true;
const frontend = 'https://miam-bf.netlify.app'
app.use(express.json());
app.use(cors({origin: frontend}));
if (process.env.NODE_ENV == "production") {
  isDev = false;
}
if (isDev) {
  console.log('isDev');
  AWS.config.update(config.aws_local_config);
} else {
  console.log('isProd');
  AWS.config.update(config.aws_remote_config);
}
router.get('/', (req, res, next) => {
    res.send({
        success: true,
        message: 'yoo ca se passe',
        test: 'ok'
      });
});
// route to connect telegram notification service
router.post('/telegram', (req, res, next) => {
    const data  = req.body.body;
    sendHttpNotificationTelegramGroup(data);
});
// route to connect web push notification service
router.post('/webpush', (req, res, next) => {
    const { data } = req.body.body;
    sendNotificationToDeviceBYWebPush(data).then(response => {
        res.send({
            success: false,
            message: response,
            test: 'ok'
          });
    })
    .catch(console.error);;
});

module.exports = router;

// send message to telegram group
async function sendHttpNotificationTelegramGroup(data) {
    const messages = data;
    return axios.post('https://api.telegram.org/' + process.env.TELEGRAM_AUTHORIZATION + '/sendMessage?chat_id=-456312332&text=' +
    messages, '').then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res.data)
        return res.data
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
           'body': data,
           'click_action': 'http://miambf.com',
           'icon': 'https://firebasestorage.googleapis.com/v0/b/flutterfoodapp-aa0df.appspot.com/o/logos%2Fmiam1-min.png?alt=media&token=9ebe4ebf-ff1e-461e-ae40-b3e0294e7bd6',
           'sound' : '../../../assets/audio/Alarm.mp3'
       },

       'to': 'fa2RC2ktfAvJ-RQOAgeyxj:APA91bHQ9xdXggOWrQZVQ2tEaIQXfhZ7t8lAmtswKYpW0rarPz7vx8zFX3ewWpXPjggKWfw3d9hPVL0p43qn-MfvkboMKz2ZC6ovBALNGtuMHYWFyWlFYG1QbJaM_x_Ifk64WB20GOdu'
    };
    
    const body = messages;


    return axios.post('https://fcm.googleapis.com/fcm/send', 
       body,
        {headers: headersWebPush }).then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res.data)
        return res.data
      })
      .catch(error => {
        console.error(error)
      });
  };

  var params = {
    AttributeNames: [
       "SentTimestamp"
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
       "All"
    ],
    QueueUrl: queueUrl,
    VisibilityTimeout: 1,
    WaitTimeSeconds: 0
   };
   
   /** receive aws sqs message */
   var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
   sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log("Receive Error", err);
    } else if (data.Messages) {
      sendNotificationToDeviceBYWebPush(data.Messages[0].body).then(response => {
        res.send({
            success: false,
            message: response,
            test: 'ok'
          });
    })
    .catch(console.error);;
    sendHttpNotificationTelegramGroup(data.Messages[0].body);
      var deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
          console.log("Delete Error", err);
        } else {
          console.log("Message Deleted", data);
        }
      });
    }
   });
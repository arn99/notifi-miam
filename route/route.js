'use strict';

require('dotenv').config();
const axios = require('axios')
const headersWebPush = { 'Authorization': process.env.WEBPUSH_AUTHORIZATION,
    'Content-Type': 'application/json' };
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send({
        success: false,
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
    sendNotificationToDeviceBYWebPush(data).catch(console.error);;
});

module.exports = router;

// send message to telegram group
async function sendHttpNotificationTelegramGroup(data) {
    const messages = data;
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
           'body': data,
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

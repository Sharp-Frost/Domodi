var express = require('express');
var NotificationServices = require('../services/notificationsServices');
var notificationServices = new NotificationServices();

module.exports = (function () {
    'use strict';
    var router = express.Router();


    //Define routes here :
    //--------------------------------------------------------------------

    router.route('/notifications/pushbullet/test')
        .post(function (req, res) {
            if (req.body.apiKey !== undefined && req.body.apiKey != null && req.body.apiKey != '') {
                // Send notification with received api key
                console.log('Received test request for pushbullet with API key :' + req.body.apiKey);
                 notificationServices.testPushBullet(req.body.apiKey, function(err, response) {
                    if (err) {
                        res.status(400).send({status: 400, message: err.message, type: 'pushbullet error'});
                    } else {
                        res.send(200);
                    }
                });
            } else {
                res.status(400).send({status: 400, message: 'no api key received', type: 'argument required'});
            }
        })

    return router;
})();




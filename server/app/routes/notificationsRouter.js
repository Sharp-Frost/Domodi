var express = require('express');
var NotificationServices = require('../services/notificationsServices');
var notificationServices = new NotificationServices();
var Notifier = require('../models/notifier');
var mongoose = require('mongoose');
var Postal = require('postal')
var channel = Postal.channel();

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
                notificationServices.testPushBullet(req.body.apiKey, function (err, response) {
                    if (err) {
                        res.status(400).send({status: 400, message: err.message, type: 'pushbullet error'});
                    } else {
                        res.send(200);
                    }
                });
            } else {
                res.status(400).send({status: 400, message: 'no api key received', type: 'argument required'});
            }
        });


    router.route('/notifications/:id')
        .put(function (req, res) {
            // find the object in DB
        });


    router.route('/notifications')
        .get(function (req, res) {
            Notifier.find(function (err, notifiers) {
                if (err)
                    res.send(err);
                res.json(notifiers);
            });
        })

        //Update All notifiers
        .put(function (req, res) {
            req.body.forEach(function (notifier) {
                if (!notifier._id) {
                    notifier._id = new mongoose.mongo.ObjectID()
                }
                //Update parent next
                Notifier.findOneAndUpdate(
                    {_id: notifier._id},
                    {
                        name: notifier.name,
                        apiKey: notifier.apiKey,
                        active: notifier.active
                    },
                    {
                        upsert: true
                    },
                    function (err) {
                        if (err)
                            res.send(err);
                    });
            });
            Notifier.find(function (err, notifiers) {
                if (err)
                    res.send(err);

                // Send message on application bus (postal)
                channel.publish("notifiers.updated", notifiers);
                res.json(notifiers);
            });

        });


    return router;
})();




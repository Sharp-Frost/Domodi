var express = require('express');

module.exports = (function () {
    'use strict';
    var router = express.Router();
    var Alert = require('../models/alert');
    var mongoose = require('mongoose');
    var Postal = require('postal')
    var channel = Postal.channel();


    //Define routes here :
    //--------------------------------------------------------------------
    router.route('/alerts')
        // GET : return all the entries
        .get(function (req, res) {
            Alert.find(function (err, items) {
                if (err)
                    res.send(err);
                res.json(items);
            }).sort({date: 'desc'});
        })

        .put(function (req, res) {
            req.body.forEach(function (item) {

                if (!item._id) {
                    item._id = new mongoose.mongo.ObjectID()
                }
                if (!item.date) {
                    item.date = new Date()
                }

                Alert.findOneAndUpdate(
                    {_id: item._id},
                    {
                        type: item.type,
                        message: item.message,
                        date: item.date

                    },
                    {
                        upsert: true,
                        runValidators: true
                    },
                    function (err) {
                        if (err)
                            res.send(err);
                    });
            });
            Alert.find(function (err, items) {
                if (err)
                    res.send(err);

                // Send message on application bus (postal)
                channel.publish("alerts.updated", items);
                res.json(items);
            }).sort({date: 'desc'});

        })

        .delete(function (req, res) {
            Alert.remove({}, function (err) {
                if (err)
                    res.send(err);

                res.send(200);
            });
        });


    router.route('/alerts/:id')
        .delete(function (req, res) {
            Alert.remove({_id: req.params.id}, function (err) {
                if (err)
                    res.send(err);

                res.send(200);
            });
        });

    return router;
})();
var express = require('express');

module.exports = (function () {
    'use strict';
    var router = express.Router();
    var Device = require('../models/device');


    //Define routes here :
    //--------------------------------------------------------------------
    router.route('/devices')
        // GET : return all the entries
        .get(function (req, res) {
            Device.find(function (err, devices) {
                if (err)
                    res.send(err);
                res.json(devices);
            });
        })

        // POST : create a new entry
        .post(function (req, res) {
            var device = new Device();      // create a new instance of the Device model
            device.name = req.body.name;    // set the device name (comes from the request)
            device.type = req.body.type;
            device.location = req.body.location;

            // save and check for errors
            device.save(function (err) {
                if (err)
                    res.send(err);
                res.json({message: 'Device ' + device.name + ' of type : ' + device.type + ' created'});
            });
        });


    router.route('/devices/:device_id')

        // GET :id : return specific entry
        .get(function (req, res) {
            Device.findById(req.params.device_id, function (err, device) {
                if (err)
                    res.send(err);
                res.json(device);
            });
        })

        // PUT :id : update specific entry
        .put(function (req, res) {
            // use our bear model to find the bear we want
            Device.findById(req.params.device_id, function (err, device) {
                if (err)
                    res.send(err);
                device.name = req.body.name;  // update the bears info
                // save the bear
                device.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({message: 'Device with id=' + req.params.device_id + 'updated with name=' + device.name});
                });
            });
        })

        // DELETE
        .delete(function (req, res) {
            Device.remove({
                _id: req.params.device_id
            }, function (err, device) {
                if (err)
                    res.send(err);
                res.json({message: 'Device deleted'});
            });
        });

    return router;
})();

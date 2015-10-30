var express = require('express');

module.exports = (function () {
    'use strict';
    var router = express.Router();
    var Profile = require('../models/profile');


    //Define routes here :
    //--------------------------------------------------------------------
    router.route('/profiles')
        // GET : return all the entries
        .get(function (req, res) {
            Profile.find(function (err, profiles) {
                if (err)
                    res.send(err);
                res.json(profiles);
            });
        })

        // POST : create a new entry
        .post(function (req, res) {
            var profile = new Profile();      // create a new instance of the Device model
            profile.name = req.body.name;    // set the device name (comes from the request)
            profile.description = req.body.description;
            profile.active = false;

            // save and check for errors
            profile.save(function (err) {
                if (err)
                    res.send(err);
                res.json({message: 'Profile ' + profile.name + ' created. Description : ' + profile.description + ' created'});
            });
        });


    router.route('/profiles/:id')
        // GET :id : return specific entry
        .get(function (req, res) {
            Profile.findById(req.params.id, function (err, profile) {
                if (err)
                    res.send(err);
                res.json(profile);
            });
        })

        // PUT :id : update specific entry
        .put(function (req, res) {
            // find the object in DB
            Profile.findById(req.params.id, function (err, profile) {
                if (err)
                    res.send(err);

                //Update active state
                if(req.body.active != undefined ) {
                    profile.active = req.body.active;
                }
                if(req.body.name != undefined ) {
                    profile.name = req.body.name;
                }
                if(req.body.description != undefined ) {
                    profile.description = req.body.description;
                }

                // save
                profile.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({message: 'Profile with id=' + req.params.id + ' updated'});
                });
            });
        })

    return router;
})();

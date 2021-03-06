var express = require('express');

module.exports = (function () {
    'use strict';
    var router = express.Router();
    var Profile = require('../models/profile');
    var Postal = require('postal')
    var channel = Postal.channel();
    var mongoose = require('mongoose');


    //Define routes here :
    //--------------------------------------------------------------------

    //TODO : use apiDoc to generate API Documentation : cf http://apidocjs.com/#getting-started
    /**
     * @api {get} /profiles/  Returns all profiles
     * @apiName GetProfile
     * @apiGroup Profile
     *
     * @apiSuccess {Array} profiles Array of all profiles.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        [
     *       {"_id":"563343f5894112480b000001","active":false,"description":"Home","name":"Home","__v":0},
     *       {"_id":"5633442c894112480b000002","active":true,"description":"Profile to use during night","name":"Night","__v":0,"delay":5000}
     *       ]
     *     }
     */
    router.route('/profiles')
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
            profile.unchangeable = req.body.unchangeable || false;

            // save and check for errors
            profile.save(function (err) {
                if (err)
                    res.send(err);
                res.json({message: 'Profile ' + profile.name + ' created. Description : ' + profile.description + ' created'});
            });
        })

        // PUT : update all profiles at the same time
        .put(function (req, res) {
            req.body.forEach(function (profile) {

                if (! profile._id) { profile._id= new mongoose.mongo.ObjectID()}
                //Update parent next
                Profile.findOneAndUpdate(
                    {_id: profile._id},
                    {
                        name: profile.name,
                        description: profile.description,
                        active: profile.active,
                        delay: profile.delay,
                        unchangeable: profile.unchangeable,
                        planning: profile.planning
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
            Profile.find(function (err, profiles) {
                if (err)
                    res.send(err);

                // Send message on application bus (postal)
                channel.publish("profiles.updated", profiles);
                res.json(profiles);
            });

        });


    router.route('/profiles/:id')
        // GET :id : return specific entry
        .get(function (req, res) {
            Profile.findById(req.params.id, function (err, profile) {
                if (err)
                    res.send(err);

            });
        })

        // PUT :id : update specific entry
        .put(function (req, res) {
            // find the object in DB
            Profile.findById(req.params.id, function (err, profile) {
                if (err)
                    res.send(err);
                console.log(req.params);

                if (req.body.active != undefined) {
                    profile.active = req.body.active;
                }
                if (req.body.name != undefined) {
                    profile.name = req.body.name;
                }
                if (req.body.description != undefined) {
                    profile.description = req.body.description;
                }
                if (req.body.delay != undefined) {
                    profile.delay = req.body.delay;
                }
                if (req.body.unchangeable != undefined) {
                    profile.unchangeable = req.body.unchangeable;
                }

                // save
                profile.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({message: 'Profile with id=' + req.params.id + ' updated'});
                });
            });
        });


    /**
     * @api {post} /profiles/:id/activate Activate a profile and deactivate the others
     * @apiName ChangeProfile
     * @apiGroup Profile
     *
     * @apiParam {Number} id Profile unique ID.
     *
     * @apiSuccess {Object} profile Profile that has been activated.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *      TODO : give a concrete example here
     *     }
     */
    router.route('/profiles/:id/activate')
        .post(function (req, res) {
            // Get profile to activate and read it's delay
            Profile.findById(req.params.id, function (err, profile) {
                if (profile.delay != undefined && profile.delay > 0) {
                    console.log("Waiting " + profile.delay + " milliseconds before changing profile");
                    setTimeout(function () {
                        Profile.activate(profile._id).then(function (profile) {
                            res.json(profile);
                        });
                    }, profile.delay); //Delaying activation in milliseconds
                } else {
                    Profile.activate(profile._id).then(function (profile) {
                        res.json(profile);
                    });
                }
            });
        });


    return router;
})();

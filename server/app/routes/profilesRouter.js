var express = require('express');

module.exports = (function () {
    'use strict';
    var router = express.Router();
    var Profile = require('../models/profile');


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

            });
        })

        // PUT :id : update specific entry
        .put(function (req, res) {
            // find the object in DB
            Profile.findById(req.params.id, function (err, profile) {
                if (err)
                    res.send(err);
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
                        activate(profile._id).then(function (profile) {
                            res.json(profile);
                        });
                    }, profile.delay); //Delaying activation in milliseconds
                } else {
                    activate(profile._id).then(function (profile) {
                        res.json(profile);
                    });
                }
            });
        });


    function activate(id) {
        // Deactivate all others
        console.log("Deactivating all other profile");
        return Profile.find({'active': true}, function (err, profiles) {
            if (err) {
                console.log("An error occured");
            } else {
                profiles.forEach(function (profile) {
                    profile.active = false;
                    profile.save();
                });
            }
        }).then(function () {
            // Activate profile
            console.log("Activating profile " + id);
            Profile.findById(id, function (err, profile) {
                profile.active = true;
                profile.save();
                return profile;
            });

        });
    }

    return router;
})();

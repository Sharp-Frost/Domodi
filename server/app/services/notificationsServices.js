var Postal = require('postal')
var PushBullet = require('pushbullet');
var Notifier = require('../models/notifier');

var channel = Postal.channel();
var subscriptions = [];
var pusher;

module.exports = function () {
    return {

        start: function () {
            console.log('Starting Notification service');

            //Retrieve pushbullet API Key from DB
            createPusher();

            //POSTAL SUBSCRIPTIONS
            //==========================================================================
            subscriptions.push(channel.subscribe('profile.updated', function (profile) {
                if (pusher) {
                    pusher.note('', 'Domodi notification', "Profile " + profile.name + " updated", function (error, response) {
                        //DO nothing ?
                    });
                }
            }));

            subscriptions.push(channel.subscribe('notifiers.updated', function (notifiers) {
                createPusher();
            }));

        },


        /**
         * Test pushbullet service with given api key
         * @param {String}  api Key.
         * @param {Function} callback     Callback for when request is complete.
         */
        testPushBullet: function (key, callback) {
            var pusher = new PushBullet(key);
            pusher.note('', 'Domodi notification', "You're API key is valid", callback);
        }
    }
}


/**
 * Create a pusher for pushbullet if it is active
 */
function createPusher() {
    pusher = null; //reset pusher

    //Search active pushbullet notifier in DB
    Notifier.findOne({name: 'pushbullet', active: true}, function (err, pushbulletNotifier) {
        if (pushbulletNotifier) {
            pusher = new PushBullet(pushbulletNotifier.apiKey);
        }
    });
}

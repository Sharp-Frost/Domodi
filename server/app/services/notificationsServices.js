var Postal = require('postal')
var channel = Postal.channel();
var subscriptions = [];
var PushBullet = require('pushbullet');
var pusher = new PushBullet('you api key');


module.exports = function () {
    return {

        start: function () {
            console.log('Starting Notification service');
            //TODO : retrieve pushbullet API Key from DB

            //TODO : Update pusher when apiKey has been modified by client

            //Subscribing to postal messages to listen to
            subscriptions.push(channel.subscribe('profile.changed', function (profile) {
                pusher.note('', 'Domodi notification', "Profile " + profile.name +" updated", function(error, response) {
                    //DO nothing ?
                } );
            }));


        },

        /**
         *
         * @param {String}  api Key.
         * @param {Function} callback     Callback for when request is complete.
         */
        testPushBullet: function (key, callback) {
            var pusher = new PushBullet(key);
            var result = {error: '', response :''};
            pusher.note('', 'Domodi notification', "You're API key is valid", callback );
        }


    }

}

function pushBulletResponse(err, response ) {
    console.log('Pushbullet response  : ' + err + ' response : ' + response );
    }

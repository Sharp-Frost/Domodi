var Postal = require('postal')
var channel = Postal.channel();
var subscriptions = [];
var PushBullet = require('pushbullet');
var pusher = new PushBullet('v1SGKIMwGa0CXP9o4ujkZZh1MeMF4OhRmWujzesR0mcLc');


module.exports = function () {
    return {

        start: function () {
            console.log('Starting Notification service');
            //TODO : initialise notification services here


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

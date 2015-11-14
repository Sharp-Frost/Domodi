/**
 * Domodi cron service
 *
 * When run read the cron to execute from DB and create related jobs
 *
 **/
var Profile = require('../models/profile');
var Schedule = require('node-schedule');
var Postal = require('postal')
var channel = Postal.channel();
var scheduledJobs= [];
var subscriptions = [];

module.exports = function() {
    return {

        start: function() {
            console.log('Starting Domodi cron service');
            updateProfilesCron();

            //Start listening on message bus to cancel and update cron when user modify them
            subscriptions.push(channel.subscribe( 'profiles.updated', function ( data ) {
                console.log('CronService received msg from postal to updateProfilesCron');
                updateProfilesCron();
            }));
        }
    };
}

 function updateProfilesCron() {

     //Read data from DB.Profiles to get all the jobs to schedule
     Profile.find({}, 'name planning', function (err, profiles) {

         //cancel all existing scheduled jobs
         scheduledJobs.forEach(function (schedule){
             schedule.cancel();
         });

         //Add new scheduled jobs
         profiles.forEach(function (profile) {
             console.log('Creating scheduled jobs for profile : ' + profile.name);
             profile.planning.forEach(function (schedule) {
                 console.log('Scheduling job at '+ schedule.hours + ':' + schedule.minutes +' every day of week :'+ schedule.day);

                 var j = Schedule.scheduleJob({hour: schedule.hours, minute: schedule.minutes, dayOfWeek: schedule.day}, function(){
                     Profile.activate(profile._id);
                 });

                 console.log('pushing scheduled jobs in array');
                 scheduledJobs.push(j);
             });
         });
         console.log('end of updateProfilesCron()');
     });

}
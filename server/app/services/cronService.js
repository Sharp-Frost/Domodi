/**
 * Domodi cron service
 *
 * When run read the cron to execute from DB and create related jobs
 *
 **/
var Profile = require('../models/profile');
var Schedule = require('node-schedule');

module.exports = function() {
    return {


        start: function() {
            console.log('Starting Domodi cron service');

            var scheduledJobs= [];

            //Read data from DB.Profiles to get all the jobs to schedule
            Profile.find({}, 'name planning', function (err, profiles) {
                profiles.forEach(function (profile) {
                    console.log('Creating scheduled jobs for profile : ' + profile.name);
                    profile.planning.forEach(function (schedule) {
                        console.log('Scheduling job at '+ schedule.hours + ':' + schedule.minutes +' every day of week :'+ schedule.day);

                        var j = Schedule.scheduleJob({hour: schedule.hours, minute: schedule.minutes, dayOfWeek: schedule.day}, function(){
                            console.log('Activating profile : '+profile.name);
                            profile.active = true;
                            profile.save();

                        });

                        scheduledJobs.push(j);
                    });
                });
            });

            //Start listening on message bus to cancel and update cron when user modify them

        }

    };
}
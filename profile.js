const builder = require('botbuilder');
const store = require('./store')
var mongoose = require('mongoose');
const util = require('./helpers/utils');

module.exports = [
    (session, args, next) => {        
        session.send( "profile_start");
        session.send( "never_share");
        builder.Prompts.text(session, "what_is_your_name");  
    },
    (session, results, next) => {
        if (results.response) {
            session.userData.name = util.capitalizeFirstLetter(results.response);
            var options = session.localizer.gettext(session.preferredLocale(), "yes_no_pnf");        
            builder.Prompts.choice(session, "are_you_pregnant", options);            
        }
    },
    (session, results, next) => {
        // Update preferred locale
        if( !results.response ){ next(); } else {      
            switch (results.response.index) {
                case 0:
                    session.send("congratulations");
                    var options = session.localizer.gettext(session.preferredLocale(), "yes_no");
                    builder.Prompts.choice(session, "sign_up", options);
                    break;
                case 1:            
                    session.endDialog("wont_say_if_pregnant");
                    break;
                case 2:            
                    session.endDialog("not_pregnant");
                    break;
            }
        }
    },
    (session, results) => {
        switch (results.response.index) {
                case 0:
                   session.userData.accecepted_terms = new Date()
                   session.send("signup_yes");
                   builder.Prompts.number(session, "how_old_are_you");               
                   break;
                case 1:
                    session.endDialog("signup_no");
                    break;
        }        
    },
    (session, results) => {
        if (results.response) {
           session.userData.current_age = results.response;
           builder.Prompts.text(session, "what_zip_code");           
        }
    },
    (session, results) => {
        if (results.response) {
           session.userData.zip_code = results.response;
           var options = session.localizer.gettext(session.preferredLocale(), "education_level_options");
           builder.Prompts.choice(session, "education_level", options);
        }
    },
    (session, results) => {
        if (results.response) {
           session.userData.education_level = results.response.entity
           store.findUser(session).then((user) => {
                Object.assign(user, session.userData)
                user.profile_completed = true;
                user.save();                        
                session.endDialog("intake_over"); 
                session.beginDialog("/intake");                          
            });
        }        
    }
]
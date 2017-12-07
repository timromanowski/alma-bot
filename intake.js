const builder = require('botbuilder');
module.exports = [
    (session, args, next) => {
        // Prompt the user to select their preferred locale
        if( session.userData.almaProfile.currentPregnancy.complete ) {            
            if( !args || !args.skip ){
                session.send( "intake_edit");
            }
            next();
        }
        else {
            session.send( "intake_start");
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
        if( !results.response ){
            builder.Prompts.time(session, "what_is_your_due_date");
        } else {
            switch (results.response.index) {
                case 0:
                    if( !session.userData.almaProfile.currentPregnancy ) {
                        session.userData.almaProfile.currentPregnancy = {}
                        session.save();
                    }                
                    session.send("signup_yes");
                    builder.Prompts.time(session, "what_is_your_due_date");
                    break;
                case 1:
                    session.endDialog("signup_no");
                    break;
            }
        }
    },
    (session, results, next) => {
        if (results.response) {
            var one_day=1000*60*60*24;
            session.dialogData.time = builder.EntityRecognizer.resolveTime([results.response]);
            var today = new Date().getTime();
            var difference_ms = session.dialogData.time - today;       
            // Convert back to days and return
            var days = Math.round(difference_ms/one_day);
            if( days < 0 ){
                session.send("due_date_in_past");
                session.replaceDialog('/intake', { skip: true });
            } else if( days > 290 ){
                session.send("due_date_too_far_away");
                session.replaceDialog('/intake', { skip: true });
            }
            else {
                session.userData.almaProfile.currentPregnancy["due_date"] = session.dialogData.time;
                session.save();
                builder.Prompts.number(session, "how_old_are_you");
            }
        }        
    },
    (session, results) => {
        if (results.response) {
            session.userData.almaProfile.currentPregnancy["current_age"] = results.response;
            session.save();
            builder.Prompts.text(session, "what_zip_code");
        }
    },
    (session, results) => {
        if (results.response) {
            session.userData.almaProfile.currentPregnancy["zip_code"] = results.response;
            session.save();
            var options = session.localizer.gettext(session.preferredLocale(), "education_level_options");
            builder.Prompts.choice(session, "education_level", options);
        }
    },
    (session, results) => {
        if (results.response) {
            session.userData.almaProfile.currentPregnancy["education_level"] = results.response;
            session.save();
            session.send("feeling_statement");
            builder.Prompts.number(session, "anxiety_question");
        }
    },
    (session, results) => {
        if (results.response) {
            session.userData.almaProfile.currentPregnancy["anxiety"] = results.response;
            session.save();
            builder.Prompts.number(session, "confidence_question");
        }
    },
    (session, results) => {
        if (results.response) {
            session.userData.almaProfile.currentPregnancy["confidence"] = results.response;
            session.userData.almaProfile.currentPregnancy["complete_date"] = new Date();
            session.userData.almaProfile.currentPregnancy["complete"] = true;
            session.save();
            session.endDialog("intake_over");
        }
    }
]
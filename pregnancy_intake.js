const builder = require('botbuilder');
const store = require('./store')
var mongoose = require('mongoose');
const util = require('./helpers/utils');

module.exports = [
    (session, args, next) => {
        // Prompt the user to select their preferred locale
        //var user = session.userData.u;
        //user.save();
        if( session.userData.p && 
            session.userData.p.intake_completed ) {            
            if( !args || !args.skip ){
                session.send( "intake_edit");
            }
            next();
        }
        else {
            session.send( "intake_start");
            builder.Prompts.time(session, "what_is_your_due_date")
            
        }    
    },        
    (session, results, next) => {
        if (results.response) {
            var one_day=1000*60*60*24;
            session.userData.current_due_date = builder.EntityRecognizer.resolveTime([results.response]);
            var today = new Date().getTime();
            var difference_ms = session.userData.current_due_date - today;       
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
                session.userData.current_pregnancy = {
                    due_date: session.userData.current_due_date
                };
                session.send("feeling_statement");
                builder.Prompts.number(session, "anxiety_question");                              
            }
        }        
    },
    (session, results) => {
        if (results.response) {
            session.userData.current_pregnancy.anxiety = results.response;
            builder.Prompts.number(session, "confidence_question");                          
        }
    },
    (session, results) => {
        if (results.response) {           
            session.userData.current_pregnancy.confidence = results.response;
            session.userData.current_pregnancy.intake_completed_date = new Date();
            session.userData.current_pregnancy.intake_completed = true;
            session.endDialog("intake_over");            
        }
    }
]
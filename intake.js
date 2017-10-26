const builder = require('botbuilder');
module.exports = [
    (session) => {
        // Prompt the user to select their preferred locale
        session.send( "intake_start");
        var options = session.localizer.gettext(session.preferredLocale(), "yes_no_pnf");
        builder.Prompts.choice(session, "are_you_pregnant", options, { listStyle: builder.ListStyle.button });
    },
    (session, results) => {
        // Update preferred locale
        switch (results.response.index) {
            case 0:
                session.send("congratulations");
                builder.Prompts.time(session, "what_is_your_due_date");
                break;
            case 1:            
                session.endDialog("wont_say_if_pregnant");
                break;
            case 2:            
                session.endDialog("not_pregnant");
                break;
        }
    },
    (session, results) => {
        if (results.response) {
            session.dialogData.time = builder.EntityRecognizer.resolveTime([results.response]);
            session.userData.almaProfile.currentPregnancy = {
                due_date: session.dialogData.time
            };
            session.save();
            session.endDialog("due_date_entered");
        }   
        
    }
]
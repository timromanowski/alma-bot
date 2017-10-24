const builder = require('botbuilder');
module.exports = [
    (session) => {
        // Prompt the user to select their preferred locale
        builder.Prompts.choice(session, "are_you_pregnant", 'Yes|No|Prefer not to answer');
    },
    (session, results) => {
        // Update preferred locale
        session.send(results.response.entity);
        switch (results.response.entity) {
            case 'Yes':
                session.endDialog("congratulations");
                break;
            case "Prefer not to answer":            
                session.endDialog("wont_say_if_pregnant");
                break;
            case "No":            
                session.endDialog("not_pregnant");
                break;
        }
    }
]
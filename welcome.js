const store = require('./store')
const builder = require('botbuilder');
var format = require('string-format')
module.exports = [
    (session) => {
        // Prompt the user to select their preferred locale
        store.findUser(session).then((user) => {
            if(!user || !user.profile_completed){
                session.send("greeting");
                session.beginDialog("/profile");         
            }
            else{
                var text = session.localizer.gettext(session.preferredLocale(), "welcome_back");
                var customMessage = new builder.Message(session).text(format(text, user.name));
                session.send( customMessage);
            }            
        });
    }
]
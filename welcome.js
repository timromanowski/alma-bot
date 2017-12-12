const store = require('./store')
const builder = require('botbuilder');
var format = require('string-format')
module.exports = [
    (session) => {
        // Prompt the user to select their preferred locale
        store.findUser(session).then((user) => {
            console.log(user)
            if(!user){
                session.send("greeting");         
            }
            else{
                var text = session.localizer.gettext(session.preferredLocale(), "welcome_back");
                var customMessage = new builder.Message(session).text(format(text, user.name));
                session.send( customMessage);
            }
            store.findCurrentPregnancy(user._id).then((prg) => {
                if( !prg || !prg.intake_completed ) {
                    session.beginDialog("/intake");
                }
                else{
                    session.endDialog();
                }
            })
        });
    }
]
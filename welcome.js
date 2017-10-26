const builder = require('botbuilder');
module.exports = [
    (session) => {
        // Prompt the user to select their preferred locale
        if( !session.userData.almaProfile  ) {
            session.userData.almaProfile = {
                firstVisit: new Date()
            };
            session.save();
            session.send("greeting");  
        }
        else{
            session.send("welcome_back");
        }
        if( !session.userData.almaProfile.currentPregnancy ){
              session.beginDialog("/intake");
        }
    }
]
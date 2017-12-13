/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure'); 
const mongoose = require('mongoose');
var intake = require('./pregnancy_intake');
var profile = require('./profile');
var help = require('./help');
var locale = require( './localePicker');
var welcome = require( './welcome');
const config = require('./config');

//=========================================================
// MongoDB Setup
//=========================================================

mongoose.connect(process.env.MONGO_URI || config.MONGO_URI, err => {
     if (err) {
         return console.error(err);
     }
     console.log("Connected to MongoDB");
}, {
    useMongoClient: true,
    /* other options */
  });

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Create your bot with a function to receive messages from the user
const bot = new builder.UniversalBot(connector, {
    localizerSettings: { 
        defaultLocale: "en" 
    }
});

// Make sure you add code to validate these fields
var luisAppId = process.env.LUIS_APP_ID;
var luisAPIKey = process.env.LUIS_KEY;
var luisAPIHostName = process.env.LUIS_HOST || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/entitylinking/v1.0/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
.matches( /^(Español|Spanish)/i,(session, args) => {
    session.preferredLocale('es', function (err) {
        if (!err) {
            // Locale files loaded
            session.send("switched_locale", "spanish");
        } else {
            // Problem loading the selected locale
            session.error(err);
        }
    });
})
.matches( /^(clear_all)/i, (session, args) => {
    session.userData.almaProfile = null;
    session.save();
})
.matches( /^edit/i, (session, args) => {
    session.beginDialog("/intake");
})
.matches( /^help/i, (session, args) => {
    session.beginDialog("/help");
})
.matches( /^language/i, (session, args) => {
    session.beginDialog("/localePicker");
})
.matches( /^(English)/i,(session, args) => {
    session.preferredLocale('en', function (err) {
        if (!err) {
            // Locale files loaded
            session.send("switched_locale", "english");
        } else {
            // Problem loading the selected locale
            session.error(err);
        }
    });
})
.onDefault((session) => {
    session.beginDialog("/welcome");
});

bot.on('conversationUpdate', function (activity) {
    if (activity.membersAdded) {
        activity.membersAdded.forEach((identity) => {
            if (identity.id === activity.address.bot.id) {
                var reply = new builder.Message()
                    .address(activity.address)
                    .text('Hi there!');
                //bot.send(reply);
                bot.beginDialog(activity.address, "/welcome");
            }
        });
    }
});
bot.dialog('/', intents);    
bot.dialog('/intake', intake).cancelAction('cancelList', "intake_canceled", { matches: /\quit\b/i });
bot.dialog('/profile', profile).cancelAction('cancelList', "intake_canceled", { matches: /\quit\b/i });
bot.dialog('/help', help).triggerAction(  /^help/i );
bot.dialog('/localePicker', locale);
bot.dialog( '/welcome', welcome );



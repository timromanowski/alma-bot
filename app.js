/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure'); 
var intake = require('./intake');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */
var tableName = "Alma"; // You define
var storageName = "almabot"; // Obtain from Azure Portal
var storageKey = process.env.MicrosoftAzureTableKey; // Obtain from Azure Portal
var azureTableClient = new azure.AzureTableClient(tableName, storageName, storageKey);
var tableStorage = new azure.AzureBotStorage({gzipData: false}, azureTableClient);

// Create your bot with a function to receive messages from the user
const bot = new builder.UniversalBot(connector, {
    localizerSettings: { 
        defaultLocale: "en" 
    }
});//.set('storage', tableStorage);;

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

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

});

bot.dialog('/', intents);    
bot.dialog('/intake', intake);



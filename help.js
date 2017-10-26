const builder = require('botbuilder');

// This dialog will create a Button Template in Facebook Messenger
// https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template
module.exports = (session) => {
    var options = session.localizer.gettext(session.preferredLocale(), "help_menu").split( '|' );
    const card = new builder.ThumbnailCard(session)
        .buttons(options.map(el => builder.CardAction.imBack(session, el, el)));

    const message = new builder.Message(session)
        .text("help_text")
        .addAttachment(card);

    // The bot's global action handlers will intercept the tapped button event
    session.endDialog(message);
};
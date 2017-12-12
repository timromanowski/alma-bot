
const consts = require('./consts');

/**
 * Returns a random example of a reminder message
 * @returns {String}
 */
exports.getRandomReminder = () => {
    return getRandom('reminder');
};

exports.capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Returns a random example of a greeting message
 * @returns {String}
 */
exports.getRandomGreeting = () => {
    return getRandom('greeting');
};






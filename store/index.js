var Promise = require('bluebird');
var mongoose = require('mongoose');
const User = require('../models/user'); 

module.exports = {
    findUser: (session) => {
        return new Promise(function (resolve) {
            User.findOne({ 'user_address.user.id': session.message.address.user.id }, (err, user) => {   
              if (err !== null || user === null) {
                // new user 
                user = {
                    user_address: session.message.address,
                    last_session_date : new Date()                    
                };  
                User.create(user, err => {
                    if (err !== null) {
                        return session.error(err);
                    }            
                });
            }
            else {
              user.last_session_date = new Date()
              user.save();              
            }
            resolve(user)
          });
       });
    }
};
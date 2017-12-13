var Promise = require('bluebird');
var mongoose = require('mongoose');
const User = require('../models/user'); 
const Pregnancy = require('../models/Pregnancy'); 
var format = require('string-format')

module.exports = {
    user: null,
    pregnancy: null,
    saveUser: (user) => {
        User.save(user)
    },
    findCurrentPregnancy: (userId) => {
        return new Promise(function (resolve) {
            var q = Pregnancy.find({'_user': userId}).sort({"time":1}).limit(1);
            q.exec((err, pregnancy) => {
                if (err !== null || pregnancy === null || pregnancy.length <= 0 ) {
                    var pregnancy = {
                       _user: userId,
                    }; 
                    Pregnancy.create(pregnancy);
                    resolve(pregnancy[0])
                    
                } else {
                    resolve(pregnancy[0])
                }
            });
        });
    },
    findUser: (session) => {
        var store = this
        return new Promise(function (resolve) {
            User.findOne({ 'user_address.user.id': session.message.address.user.id }) 
            .populate('pregnancies').exec((err, user) => {   
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
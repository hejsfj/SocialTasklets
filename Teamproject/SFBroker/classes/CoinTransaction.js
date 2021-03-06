var constants = require('../constants');
var Models = require("../app"); //Instantiate a Models object so you can access the models.js module.
var mongoose = require('mongoose');
var uuidV1     = require('uuid/v1');

var CoinRequests = require("../models/CoinRequests");
var Coins = mongoose.model("Coins", CoinRequests.coinRequestSchema);

function coinTransaction(data) {
    this.requestid = data.requestid;
    if (this.requestid == null) {
        this.requestid = uuidV1();
    }
    this.username = data.username,
    this.requestedCoins = data.requestedCoins,
    this.approval = data.approval
}
//creates a new database entry or updates the existing ones
coinTransaction.prototype.save = function (callback) {
    var tmpCoin = this;
    Coins.findOne({'requestid': tmpCoin.requestid}, function (e, udata) {
    //if no entry was not found, then create it
        if (udata == null) {
            var coin_req = new Coins(tmpCoin);
            coin_req.save({}, function (error, data) {
                if (error) {
                    console.error(error);
                }
                if (callback) {
                    callback(null, true);
                }
            });
        }
        //an entry was found, therefore update it with the new values
        else {
            Coins.update({'requestid': tmpCoin.requestid},{
            username: tmpCoin.username,
            requestedCoins: tmpCoin.requestedCoins,
            approval: tmpCoin.approval
                },
                function (error, data) {
                    if (error) {
                        callback(error, false);
                    }
                    else if (callback) {
                        callback(null, true);
                    }
                });
        }
    });
}

//find all the entries in the database
function findAll(callback) {
    Coins.find({}, function (e, data) {
        if (e) callback(e, null);
        if (callback) callback(null, data);
    });
}

//find the entries that belong to a certain user
function findByUser(data, callback) {
    Coins.find({ 'username' : data.username }, function (e, data) {
        if (e) callback(e, null);
        if (callback) callback(null, data);
    });
}

//find coin requests based on the status of the approval
function findByApproval(data, callback) {
    Coins.find({ 'approval' : data.approval }, function (e, data) {
        if (e) callback(e, null);
        if(callback) callback(null, data);
    });
}
//delete the entries that belong to a certain user
function deleteByUser(data, callback) {
    var username = data.username;
    Coins.remove({ 'username': username }, function (err, data) {
        if (err) callback(err, null);
         callback(null, true);
    });
}

module.exports = {
    coinTransaction: coinTransaction,

    get: function (data) {
        return new coinTransaction(data);
    },

    findAll: function (data, callback) {
        return findAll(data, callback);
    },

    findByUser: function (data, callback) {
        return findByUser(data, callback);
    },

    findByApproval: function (data, callback) {
        return findByApproval(data, callback);
    },

    deleteByUser: function (data, callback) {
        return deleteByUser(data, callback);
    }
}
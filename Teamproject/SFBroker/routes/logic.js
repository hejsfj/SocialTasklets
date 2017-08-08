//the functions that are used in the APIs with the Broker

var dbAccess = require('./dbAccess');
var constants = require('../constants');
var user = require('../classes/User');
var log = require('./../replication/log');
var broker_log = require('./../replication/broker_log');

//********************** tested ***************//
function findAllTransactions(user, callback) {
    var user = user.username;
    var transactionsProcessed = 0;
    var transactionList = '[';
    dbAccess.find({type: constants.Accounting, username: user}).exec(function (e, res) {
        if (e) callback(e, null);
        res.forEach(function (data, index, array) {
            transactionList = transactionList.concat('{ "consumer": "' + data.consumer +
                '", "provider": "' + data.provider +
                '", "computation": ' + data.computation +
                ', "coins": ' + data.coins +
                ', "status": "' + data.status +
                '", "taskletid": "' + data.taskletid + '" }');
            transactionsProcessed += 1;
            if (transactionsProcessed == array.length) {
                transactionList = transactionList.concat(']');
                transactionList = transactionList.replace('}{', '},{');
                callback(null, transactionList);
            }
            else {
                transactionList = transactionList.replace('}{', '},{');
            }
        });
    });
}

function findFriends(user, callback) {
    var F_List = '[';
    var user = user.username;
    var friend;
    var key = 'Network';
    var status;
    var userProcessed = 0;
    dbAccess.find({type: constants.Friendship, username: user, key: key}).exec(function (e, res) {
        if (e) callback(e, null);
        res.forEach(function (data, index, array) {
            if (data.status == constants.FriendshipStatusRequested) {
                if (data.user_1 == user) {
                    friend = data.user_2;
                    status = constants.FriendshipStatusRequested;
                } else if (data.user_2 == user) {
                    friend = data.user_1;
                    status = constants.FriendshipStatusPending;
                    console.log('HIER' + status);
                    console.log('HIER' + status);
                }
            }
            else if (data.status == constants.FriendshipStatusConfirmed) {
                if (data.user_1 == user) {
                    friend = data.user_2;
                } else if (data.user_2 == user) {
                    friend = data.user_1;
                }
                status = data.status;
        }
            F_List = F_List.concat('{ "name": "' + friend + '", "status": "' + status + '"}');
            userProcessed += 1;
            if (userProcessed == array.length) {
                F_List = F_List.concat(']');
                F_List = F_List.replace('}{', '},{');
                callback(null, F_List);
            }
            else{
                F_List = F_List.replace('}{', '},{');
            }
        });
    });
}

//********************** tested ***************//
//update user's balance
function updateBalance(difference, username) {
    dbAccess.find({type: constants.User, username: username}).exec(function (e, data) {
        var balance = data.balance;

        if (isNaN(difference)){
            difference = 0; }
        balance = balance + difference;
        var userb = new user({
            username: username,
            balance: balance,
        });
        userb.update();
    });
};

module.exports = {
    CollectUpdates: function(data, id, key){
            return CollectUpdates(data, id, key) ; },
    updateBroker: function(broker) {
            return updateBroker(broker); },
    syncBroker: function(broker, version) {             //*********** its a local function, no need to export
             return syncBroker(broker, version); },
    readBroker: function(broker) {
            return readBroker(broker);
    }
};
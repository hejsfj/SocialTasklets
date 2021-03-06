//keeps track of every change that happens in SF_Broker's side
let updates = [];
var latest_change = 1 ; //starts from 1 because the incrementation is preformed after storing the first update in the log
var temp;
module.exports = {
//concatenate the changes into a single string
  add: function (data)
     {
     temp = '{ "changed_entry": ' + data + ', "version": ' + latest_change + ' }';
     updates = updates.concat(temp);
     //increase the update version
     latest_change = latest_change + 1;
     },
//will generate the array
  read_updates: () => updates,

  read_version: () => latest_change,

//Set array to empty and latest change to 1.
  restart: function(){
  updates = [] ;
  latest_change = 1;
   },
}

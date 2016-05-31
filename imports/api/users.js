import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ChatHistory = new Mongo.Collection('chatHistory');


if (Meteor.isServer) {
  // This code only runs on the server
Meteor.publish("allUsers", function () {
  if (this.userId) {
    return Meteor.users.find({});
  } else {
    this.ready();
  }
});
Meteor.publish("chatHistory", function (UID) {
  if (this.userId) {
  	console.log('form server ', UID);
    return ChatHistory.find({'UID':UID},{'history':1,'chattingTo':1});
  } 
});
}


Meteor.methods({
// 	'chatHistory.insert'(text,userId) {
// 		check(text, String);
// 		if (! Meteor.user()) {
// 			throw new Meteor.Error('not-authorized!');
// 		}
// 		if (ChatHistory.findOne()) {
// 			ChatHistory.update()
// 		}else {
// 			ChatHistory.insert()
// 		}
// 	},
'chatHistory.addChattingHistory'(text, owner, chattingTo, UID) {

if(ChatHistory.find({'UID':UID})['UID']){
ChatHistory.update({'UID':UID},{$push:{'history':{'text':text,'creatAt':new Date()}}})


}else {
	ChatHistory.insert({
						'chattingTo':chattingTo,
						'lastModified':new Date(),
						'UID':UID,
						'history':[{'text':text,'creatAt':new Date(),'creatBy':owner}]}
					)
}
// alert(ChatHistory.find({'UID':UID})['UID'])


},


});





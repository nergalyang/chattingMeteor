import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find(
    	{
    		$or: [
    			{ private: {$ne: true}},
    			{ owner: this.userId },
    		],
    	}
    );
  });


// Meteor.publish("allUsers", function () {
//   if (this.userId) {
//     return Meteor.users.find({});
//   } else {
//     this.ready();
//   }
// });
}

Meteor.methods({
	'tasks.insert'(text) {
		check(text, String);
		if (! Meteor.user()) {
			throw new Meteor.Error('not-authorized!');
		}
		Tasks.insert({
			text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username,
		})
	},
	'tasks.remove'(taskId) {
		check(taskId, String);
		const task = Tasks.findOne(taskId);
		if ( task.owner !== Meteor.user()) {
			throw new Meteor.Error('not-authorized');
		}
		Tasks.remove(taskId);
	},
	'tasks.updateCheck'(taskId, setCheck) {
		check(taskId, String);
		check(setCheck, Boolean);

		const task = Tasks.findOne(taskId);
		if ( task.private && task.owner !== Meteor.userId) {
			throw new Meteor.Error('not-authorized')
		}

		Tasks.update(taskId, {
			$set: {checked: setCheck}
		});
	},
	'tasks.getChecked'() {
		Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
	},
	'tasks.getAll'() {
		Tasks.find({}, { sort: { createdAt: -1 } });
	},
  	'tasks.setPrivate'(taskId, setToPrivate) {
    	check(taskId, String);
    	check(setToPrivate, Boolean);
 
    	const task = Tasks.findOne(taskId);
 
   		// Make sure only the task owner can make a task private
    	if (task.owner !== Meteor.userId()) {
      		throw new Meteor.Error('not-authorized');
   		 }
 
    	Tasks.update(taskId, { $set: { private: setToPrivate } });
  },

});




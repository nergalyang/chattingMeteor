import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import { ChatHistory } from '../api/users.js';
import '../api/users.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import './body.html';
// import './task.js';

Template.body.onCreated(function bodyOnCreated() {
  this.bottom = new ReactiveDict();
  this.state = new ReactiveDict();
  this.UID = new ReactiveDict();
  Meteor.subscribe('allUsers');
  this.state.set('chattingToNow', Meteor.userId())
  var x = parseInt(ChatHistory.find({}).count())*385;
  $('.chat-list').scrollTop(x);
});

Tracker.autorun(function () {
  var oldest = _.max(ChatHistory.find({}).count())
  if (oldest) {scrollToBottom()}
});


Template.body.helpers({

  isOwner:function(name){
    if ( name === Meteor.userId()){
      return true
    }
  },

  chatContent() {
    var x = Template.instance().UID.get('UID');
    // scrollToBottom();
    return ChatHistory.find({'UID':x},{sort: {lastModified: 1}})
  },
  users() {
    return Meteor.users.find({},{sort: {username: 1}})
  },
});





Template.body.events({

  'click .userName'(event, instance) {
    instance.state.set('chattingToNow', this._id)
    var UID = Meteor.userId()>instance.state.get('chattingToNow')?Meteor.userId()+instance.state.get('chattingToNow'):instance.state.get('chattingToNow')+Meteor.userId();
    instance.UID.set('UID',UID);
    instance.bottom.set('true',true);
    Meteor.subscribe('chatHistory',UID,function(){
      // var x ='.'+Meteor.userId();
      // $(x).addClass('right');
      // scrollToBottom();
    });
    var target = event.target
    $('.userName').removeClass('abc')
    $(event.target).addClass("abc"); 
  },
  'submit .chatInput'(event, instance) {
    event.preventDefault();
    // Get value from form element
    const target = event.target;
    text = target.text.value;
    instance.bottom.set('true',true);
    var UID = Meteor.userId()>instance.state.get('chattingToNow')?Meteor.userId()+instance.state.get('chattingToNow'):instance.state.get('chattingToNow')+Meteor.userId();
    // const text = target.text.value;
    // Insert a task into the collection
    // Meteor.call('chatHistory.update', text, Meteor.userId(), instance.state.get('chattingToNow'));
    Meteor.call('chatHistory.addChattingHistory', text, Meteor.userId(), instance.state.get('chattingToNow'), UID);
    // var x ='.'+Meteor.userId();
    // $(x).addClass('right');
    scrollToBottom();
    target.text.value = ''
  },
});


function scrollToBottom (){
  var height = 0;
  $('.chat-list div').each(function(i, value){
      height += parseInt($(this).height());
  });
  $('.chat-list').scrollTop(height);

}


/*
----------------------------------------------------
SERVER
----------------------------------------------------
*/

if (Meteor.isServer) {}

/*
----------------------------------------------------
CLIENT
----------------------------------------------------
*/

if (Meteor.isClient) {

    Session.set('isLoading', true);

    /*
    ----------------------------------------------------
    CHAT
    ----------------------------------------------------
    */

    Template.chat.onCreated(function() {

        lodash.delay(function() {
            Session.set('isLoading', false);
        }, 1000);

        Tracker.autorun(function() {
            //elem.scrollTop = elem.scrollHeight;
        });

    });

    Template.chat.helpers({

        isLoading: function() {
            return Session.get('isLoading');
        },

        messages: function() {
            return Messages.find({}, {sort: {time: 1}});
        },

        messagesCount: function() {
            return Messages.find().count();
        },

        fromNow: function(date) {
            return moment(date).fromNow();
        }

    });

    /*
     ----------------------------------------------------
     FORM
     ----------------------------------------------------
     */

    Template.form.onCreated(function() {

        this.models = new ReactiveDict();
        this.models.set('message', null);

        this.postMessage = function(name, message) {

            Messages.insert({
                name: name,
                message: message,
                time: Date.now()
            });

        };

        this.initBot = function(message) {

            var that = this,
                name = 'Bot',
                response;

            switch (message) {

                case 'time?':

                    response = 'The time is ' + moment(Date.now()).format('hh:mm');
                    break;

                case 'day?':

                    response = 'The day today is ' + moment(Date.now()).format('dddd');
                    break;

            }

            if (response) {
                that.postMessage(name, response);
            }

        };
    });

    Template.form.events = {

        'change input': function(e, template) {

            template.models.set('message', e.target.value);

        },

        'click i': function(e, template) {

            template.$('form').submit();

        },

        'submit form': function(e, template) {

            e.preventDefault();

            var message = template.models.get('message'),
                $message = template.$('input'),
                name = 'Guest';

            if (message) {

                template.postMessage(name, message);
                template.initBot(message);

                template.models.set('message', null);
                $message.val('');

            }

        }

    };

}
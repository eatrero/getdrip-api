'use strict';

var request = require('request');

function getDrip(apiToken, accountId) {
    if (!(this instanceof getDrip)) {
        return new getDrip(apiToken, accountId);
    }

    this.apiToken = apiToken;
    this.accountId = accountId;
    this.host = 'https://api.getdrip.com/v2';
    this.header = [
        {
            name: 'content-type',
            value: 'application/x-www-form-urlencoded'
        }
    ];

    this.getAccounts = function (cb) {
        request.get({
                url: this.host + '/accounts',
                auth: {'user': this.apiToken},
                json: true,
                header: this.header
            },
            function (err, res, body) {
                cb(err, res, body);
            })
    };

    this.getSubscribers = function (cb) {
        request.get({
                url: this.host + '/' + this.accountId + '/subscribers',
                auth: {'user': this.apiToken},
                json: true,
                header: this.header
            },
            function (err, res, body) {
                cb(err, res, body);
            })
    };

    this.getSubscriber = function (subscriberId, cb) {
        request.get({
                url: this.host + '/' + this.accountId + '/subscribers/' + subscriberId,
                auth: {'user': this.apiToken},
                json: true,
                header: this.header
            },
            function (err, res, body) {
                cb(err, res, body);
            })
    };

    this.createSubscriber = function (email, opts, cb) {
        var reqBody = {email: email};
        var optionals = ['new_email', 'user_id', 'time_zone', 'ip_address', 'custom_fields', 'tags', 'remove_tags', 'prospect'];

        optionals.map(function (o) {
            if (opts.hasOwnProperty(o))
                reqBody[o] = opts[o];
        });

        request.post({
                url: this.host + '/' + this.accountId + '/subscribers/',
                auth: {'user': this.apiToken},
                json: true,
                header: this.header,
                body: {subscribers: [reqBody]}
            },
            function (err, res, body) {
                cb(err, res, body);
            })
    };

    this.deleteSubscriber = function (subscriberId, cb) {
        request.del({
                url: this.host + '/' + this.accountId + '/subscribers/' + subscriberId,
                auth: {'user': this.apiToken},
                json: true,
                header: this.header
            },
            function (err, res, body) {
                cb(err, res, body);
            })
    };

    this.createTag = function (email, tag, cb) {
        request.post({
                url: this.host + '/' + this.accountId + '/tags' ,
                auth: {'user': this.apiToken},
                json: true,
                header: this.header,
                body: {tags: [ { email : email, tag : tag } ]}
            },
            function (err, res, body) {
                cb(err, res, body);
            })
    };

    this.createEvent = function (email, action, opts, cb) {
        var reqBody = {email: email, action: action, occured_at: new Date()};
        var optionals = ['prospect', 'properties'];

        optionals.map(function (o) {
            if (opts.hasOwnProperty(o))
                reqBody[o] = opts[o];
        });

        request.post({
                url: this.host + '/' + this.accountId + '/events',
                auth: {'user': this.apiToken},
                json: true,
                header: this.header,
                body: {events: [reqBody]}
            },
            function (err, res, body) {
                cb(err, res, body);
            })
    };

    this.getCampaigns = function (cb) {
        request.get({
                url: this.host + '/' + this.accountId + '/campaigns',
                auth: {'user': this.apiToken},
                json: true,
                header: this.header
            },
            function (err, res, body) {
                cb(err, res, body);
            })
    };

    this.subscribeToCampaign = function( email, campaignId, opts, cb) {
        var reqBody = {email: email};
        var optionals = ['user_id', 'time_zone', 'double_optin', 'starting_email_index',
            'custom_fields', 'tags', 'reactivate_if_removed', 'prospect'];

        optionals.map(function (o) {
            if (opts.hasOwnProperty(o))
                reqBody[o] = opts[o];
        });

        request.post({
                url: this.host + '/' + this.accountId + '/campaigns/' + campaignId + '/subscribers',
                auth: {'user': this.apiToken},
                json: true,
                header: this.header,
                body: {subscribers: [reqBody]}
            },
            function (err, res, body) {
                cb(err, res, body);
            })
    }

}

module.exports = getDrip;
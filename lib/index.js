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

    this.getSubscribers = function (opts, cb) {
        if (typeof opts === 'function') {
          // For backwards-compatibility
          cb = opts;
          opts = {};
        }

        var url = this.host + '/' + this.accountId + '/subscribers';
        var qs = Object.keys(opts).map(function(key) {
            return key + '=' + opts[ key ];
        }).join('&');
        request.get({
                url: (qs ? url + '?' + qs : url),
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

    this.createTags = function (email, tags, cb) {
        var responses = [];
        var errors = [];
        var requestsCompleted = 0;

        for (var i = 0; i < tags.length; i++) {
                request.post({
                    url: this.host + '/' + this.accountId + '/tags' ,
                    auth: {'user': this.apiToken},
                    json: true,
                    header: this.header,
                    body: {tags: [ { email : email, tag : tags[i] } ]}
                },
                function (err, res, body) {
                    if(err)
                        errors.push(err);

                    requestsCompleted++;
                    responses.push(res);

                    if(requestsCompleted === tags.length) {
                        errors = errors.length > 0 ? errors : null;
                        cb(errors, responses, body);
                    }
                })
        }


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

    this.unsubscribeFromCampaign = function( email, campaignId, cb) {
        var reqBody = {};

        request.post({
                url: this.host + '/' + this.accountId + '/subscribers/' + email + '/unsubscribe?campaign_id=' + encodeURIComponent(campaignId),
                auth: {'user': this.apiToken},
                json: true,
                header: this.header,
                body: reqBody
            },
            function (err, res, body) {
                cb(err, res, body);
            })
    }

    this.unsubscribeFromCampaigns = function( email, cb) {
        var reqBody = {};

        request.post({
                url: this.host + '/' + this.accountId + '/subscribers/' + email + '/unsubscribe',
                auth: {'user': this.apiToken},
                json: true,
                header: this.header,
                body: reqBody
            },
            function (err, res, body) {
                cb(err, res, body);
            })
    }
    
    this.startOnAWorkflow = function( email, workflowId, opts, cb) {
    var reqBody = {email: email};
    var optionals = ['user_id', 'time_zone', 'custom_fields', 'tags', 'prospect'];

    optionals.map(function (o) {
      if (opts.hasOwnProperty(o))
        reqBody[o] = opts[o];
    });

    console.log(reqBody);
    request.post({
        url: this.host + '/' + this.accountId + '/workflows/' + workflowId + '/subscribers',
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

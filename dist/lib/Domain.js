System.register("../../lib/Domain", [], function() {
  "use strict";
  var __moduleName = "../../lib/Domain";
  var EventStore = require("eventstore"),
      Repository = require("./Repository"),
      co = require("co"),
      Actor = require("./Actor"),
      eventstore = Symbol("eventstore"),
      ActorListener = require("./ActorListener"),
      EventBus = require("./EventBus");
  var Domain = function Domain(options) {
    this[eventstore] = EventStore(options);
    this.ActorClasses = {};
    this.repos = {};
    this.eventBus = new EventBus(this[eventstore], this.repos);
    var self = this;
    co($traceurRuntime.initGeneratorFunction(function $__4() {
      var repo,
          actorListener;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              self.register(ActorListener);
              repo = self.repos["ActorListener"];
              $ctx.state = 11;
              break;
            case 11:
              $ctx.state = 2;
              return repo.get("ActorListenerId");
            case 2:
              actorListener = $ctx.sent;
              $ctx.state = 4;
              break;
            case 4:
              $ctx.state = (!actorListener) ? 5 : 8;
              break;
            case 5:
              $ctx.state = 6;
              return repo.create();
            case 6:
              actorListener = $ctx.sent;
              $ctx.state = 8;
              break;
            case 8:
              self.actorListener = actorListener;
              actorListener.actorRepos = self.repos;
              self.eventBus.on("*", function(evt) {
                if (evt.targetType === "ActorListener")
                  return;
                actorListener.call("pub", {
                  eventName: evt.targetType + "." + evt.targetId + ":" + evt.name,
                  event: evt
                });
                actorListener.pub({
                  eventName: evt.targetType + "." + evt.targetId,
                  event: evt
                });
                actorListener.pub({
                  eventName: evt.targetType + ":" + evt.name,
                  event: evt
                });
                actorListener.pub({
                  eventName: "." + evt.targetId + ":" + evt.name,
                  event: evt
                });
                actorListener.pub({
                  eventName: ":" + evt.name,
                  event: evt
                });
                actorListener.pub({
                  eventName: evt.targetType,
                  event: evt
                });
                if (evt.contextId) {
                  actorListener.pub({
                    eventName: evt.targetType + "." + evt.targetId + "&" + evt.contextId,
                    event: evt
                  });
                  actorListener.pub({
                    eventName: evt.targetType + ":" + evt.name + "&" + evt.contextId,
                    event: evt
                  });
                  actorListener.pub({
                    eventName: "." + evt.targetId + ":" + evt.name + "&" + evt.contextId,
                    event: evt
                  });
                  actorListener.pub({
                    eventName: ":" + evt.name + "&" + evt.contextId,
                    event: evt
                  });
                  actorListener.pub({
                    eventName: evt.targetType + "&" + evt.contextId,
                    event: evt
                  });
                }
              });
              $ctx.state = -2;
              break;
            default:
              return $ctx.end();
          }
      }, $__4, this);
    }))();
    this[eventstore].init();
  };
  ($traceurRuntime.createClass)(Domain, {
    register: function(ActorClass) {
      var self = this;
      if (typeof ActorClass !== "function") {
        ActorClass = Actor.extend(arguments[0], arguments[1]);
      }
      if (!ActorClass.prototype.myDomain) {
        Object.defineProperty(ActorClass.prototype, "myDomain", {get: function() {
            return self;
          }});
      }
      this.ActorClasses[ActorClass.type] = ActorClass;
      var repo = new Repository(ActorClass, this[eventstore]);
      this.repos[ActorClass.type] = repo;
      this._actorEventHandle(repo);
      return this;
    },
    _actorEventHandle: function(repo) {
      var $__0 = this;
      var self = this;
      function actorApplyEventHandle(actor) {
        self.eventBus.publish(actor);
      }
      function actorListenEventHandle(actor, eventName, handleMethodName, contextId, onlyContext) {
        self.actorListener.call("listen", {
          actor: actor,
          eventName: eventName,
          handleMethodName: handleMethodName,
          contextId: contextId,
          onlyContext: onlyContext
        });
      }
      var listenActorEventHandle = (function(actor) {
        actor.on("apply", actorApplyEventHandle);
        actor.on("listen", actorListenEventHandle);
        if (actor.uncommittedEvents.length) {
          $__0.eventBus.publish(actor);
        }
      });
      repo.on("create", listenActorEventHandle);
      repo.on("reborn", listenActorEventHandle);
    },
    create: function(actorType, data, callback) {
      callback = callback || function() {};
      var repo = this.repos[actorType];
      co($traceurRuntime.initGeneratorFunction(function $__4() {
        var actor,
            e;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                $ctx.pushTry(7, null);
                $ctx.state = 10;
                break;
              case 10:
                $ctx.state = 2;
                return repo.create(data);
              case 2:
                actor = $ctx.sent;
                $ctx.state = 4;
                break;
              case 4:
                callback(null, actor.id);
                $ctx.state = 6;
                break;
              case 6:
                $ctx.popTry();
                $ctx.state = -2;
                break;
              case 7:
                $ctx.popTry();
                e = $ctx.storedException;
                $ctx.state = 13;
                break;
              case 13:
                callback(e);
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, $__4, this);
      }))();
    },
    get: function(actorType, actorId, cb) {
      var self = this;
      co($traceurRuntime.initGeneratorFunction(function $__4() {
        var repo,
            actor,
            e;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                $ctx.pushTry(9, null);
                $ctx.state = 12;
                break;
              case 12:
                repo = self.repos[actorType];
                $ctx.state = 6;
                break;
              case 6:
                $ctx.state = 2;
                return repo.get(actorId);
              case 2:
                actor = $ctx.sent;
                $ctx.state = 4;
                break;
              case 4:
                cb(null, actor);
                $ctx.state = 8;
                break;
              case 8:
                $ctx.popTry();
                $ctx.state = -2;
                break;
              case 9:
                $ctx.popTry();
                e = $ctx.storedException;
                $ctx.state = 15;
                break;
              case 15:
                cb(e);
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, $__4, this);
      }))();
    },
    addListener: function(eventName, listener) {
      this.eventBus.on(eventName, listener);
    },
    getHistory: function() {
      var $__3;
      for (var opts = [],
          $__2 = 0; $__2 < arguments.length; $__2++)
        opts[$__2] = arguments[$__2];
      ($__3 = this[eventstore]).getEvents.apply($__3, $traceurRuntime.spread(opts));
    }
  }, {});
  module.exports = Domain;
  return {};
});
System.get("../../lib/Domain" + '');

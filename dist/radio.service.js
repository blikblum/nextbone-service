(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('backbone.radio'), require('backbone'), require('underscore')) :
  typeof define === 'function' && define.amd ? define(['backbone.radio', 'backbone', 'underscore'], factory) :
  (global.radio = global.radio || {}, global.radio.service = factory(global.Radio,global.backbone,global._));
}(this, (function (Radio,backbone,_) { 'use strict';

  Radio = Radio && Radio.hasOwnProperty('default') ? Radio['default'] : Radio;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;

  var resolved = Promise.resolve();

  var extend = backbone.Model.extend;

  /**
   * @class Service
   */

  var Service = extend.call(Radio.Channel, {
    constructor: function constructor() {
      var _this = this;

      var start = _.once(function () {
        return resolved.then(function () {
          return _this.start();
        });
      });
      var requests = _.result(this, 'requests');
      _.each(requests, function (val, key) {
        _this.reply(key, function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var promise = start().then(function () {
            return _this[val].apply(_this, args);
          });

          promise.catch(function (err) {
            _this.onError(err);
          });

          return promise;
        });
      });

      Radio.Channel.prototype.constructor.apply(this, arguments);
    },

    /**
     * @abstract
     * @method setup
     */
    setup: function setup() {},


    /**
     * @abstract
     * @method start
     */
    start: function start() {},


    /**
     * @abstract
     * @method onError
     */
    onError: function onError() {}
  });

  Service.extend = extend;

  return Service;

})));
//# sourceMappingURL=radio.service.js.map

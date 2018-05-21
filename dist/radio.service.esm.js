import Radio from 'backbone.radio';
import { Model } from 'backbone';
import _ from 'underscore';

var resolved = Promise.resolve();

var extend = Model.extend;

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

export default Service;
//# sourceMappingURL=radio.service.esm.js.map

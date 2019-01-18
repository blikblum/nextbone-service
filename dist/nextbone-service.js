import { Channel } from 'nextbone-radio';
import _ from 'underscore';

const resolved = Promise.resolve();
/**
 * @class Service
 */

class Service extends Channel {
  constructor(channelName) {
    super(channelName);

    const start = _.once(() => resolved.then(() => this.start()));

    const requests = this.constructor.requests;

    _.each(requests, (val, key) => {
      this.reply(key, (...args) => {
        const promise = start().then(() => this[val](...args));
        promise.catch(err => {
          this.onError(err);
        });
        return promise;
      });
    });
  }
  /**
   * @abstract
   * @method setup
   */


  setup() {}
  /**
   * @abstract
   * @method start
   */


  start() {}
  /**
   * @abstract
   * @method onError
   */


  onError() {}

}

export { Service };
//# sourceMappingURL=nextbone-service.js.map

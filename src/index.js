import Radio from 'backbone.radio'
import {Model} from 'backbone'
import _ from 'underscore'

const resolved = Promise.resolve()

const extend = Model.extend

/**
 * @class Service
 */

const Service = extend.call(Radio.Channel, {
  constructor () {
    const start = _.once(() => resolved.then(() => this.start()))
    const requests = _.result(this, 'requests')
    _.each(requests, (val, key) => {
      this.reply(key, (...args) => {
        let promise = start().then(() => this[val](...args))

        promise.catch(err => {
          this.onError(err)
        })

        return promise
      })
    })

    Radio.Channel.prototype.constructor.apply(this, arguments)
  },
  /**
   * @abstract
   * @method setup
   */
  setup () {},

  /**
   * @abstract
   * @method start
   */
  start () {},

  /**
   * @abstract
   * @method onError
   */
  onError () {}
})

Service.extend = extend

export default Service

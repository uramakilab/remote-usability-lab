/**
 * Class that represents the Log object, where it recorded the evaluator's interactions in the test
 * @type {Log}
 */
export class Log {

    /**
     * Create a log
     * @param {object} payload - data to creates object
     * @param {Date} payload.date - date last record 
     * @param {number} payload.progress - progress porcentage
     * @param {string} payload.status - evaluator progress status  
     */

    constructor(payload) {
        this._date = payload.date
        this._progress = payload.progress
        this._status = payload.status
    }

    /**
    * Get the date value
    * @returns {Date} the date value
    */
    get date() {
        return this._date
    }

    /**
    * Get the progress value
    * @returns {number} the progress value
    */
    get progress() {
        return this._progress
    }

    /**
    * Get the status value
    * @returns {string} the status value
    */
    get status() {
        return this._status
    }

    /**
    * Set the date attribute
    * @param {Date} date - the date value 
    */
    set date(date) {
        this._date = date
    }

    /**
    * Set the progress attribute
    * @param {number} progress - the progress value 
    */
    set progress(progress) {
        this._progress = progress
    }

    /**
    * Set the state attribute
    * ['Invited','Denied','In progress','Completed','Submitted']
    * @param {string} state - the state value 
    */
    set state(state) {
        this._status = state
    }
}
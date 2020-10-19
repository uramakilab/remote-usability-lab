import Log from "./Log"

/**
 * Class that represents the report object
 *  @type {Report}
 */
export default class Report {
    /**
     * Create a report
     * @param {object} payload - data to crates object  
     * @param {string} payload.uid - evaluator identification
     * @param {string} payload.email = evaluator email
     * @param {Log} payload.log - record of evaluator interactions
     */
    constructor(payload) {
        this._uid = payload.uid
        this._email = payload.email
        this._log = new Log(payload.log)
    }

    /**
    * Get the uid value
    * @returns {string} the uid value
    */
    get uid() {
        return this._uid
    }

    /**
    * Get the email value
    * @returns {string} the email value
    */
    get email() {
        return this._email
    }

    /**
    * Get the log value
    * @returns {Log} the log value
    */
    get log() {
        return this._log
    }

    /**
     * Set the log attribute
     * @param {Log} the log value 
     */
    set log(log) {
        this._log = log
    }

}
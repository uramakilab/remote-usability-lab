import Report from "./Report"

/**
 * Class that represents the reporting document, where test reports are saved
 * @type {ReportsDocument}
 */
export default class ReportsDocument {
    /**
     * Create a report document
     * @param {object} payload - data to creates a report documente
     * @param {string} payload.id - Report document identification
     * @param {object} payload.test - header with test information 
     * @param {Array.<Report>}payload.reports - reports array 
     */
    constructor(payload) {
        this._id = payload.id
        this._test = payload.test
        this._repots = payload.reports.map(report => new Report(report))
    }

    //Getters and Setters

    /**
     * Get the reports value
     * @returns {Array.<Report>} the reports value
     */
    get reports() {
        return this._repots
    }

    /**
     * Get the id value
     * @returns {string} the id value
     */

    get id() {
        return this._id
    }

    /**
     * Get the test value
     * @returns {object} the test value
     */
    get test() {
        return this._test
    }


    /**
     * Push a report into Array reports
     * @param {Report} report - a new report
     */
    pushReport(report) {
        console.log("Push", report)
        this._repots.push(new Report(report))
    }

    /**
     * Remove a report from Array reports
     * @param {Report} report - report will be removed
     */
    removeReport(report) {
        this._repots.slice(this._repots.indexOf(report), 1)
    }




}
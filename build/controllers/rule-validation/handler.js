"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const messages_1 = require("../../utils/messages");
const error_codes_1 = require("../../utils/error-codes");
let { Engine } = require('json-rules-engine');
let engine = new Engine();
// import ApiRequest from '../../apis/api-requests';
const Util = require('../../helper/util');
const util1 = new Util();
const ApiRequest = require('../../apis/api-requests');
const apiRequest = new ApiRequest();
const helper_1 = require("../../helper/helper");
let counter = 0;
const finalErrorThreshold = 1;
let outcomes = [];
class RuleValidation {
    async validate(req, res) {
        const body = req.body;
        const rules = (0, helper_1.getRules)();
        rules.forEach((rule, index) => {
            let event = eval(rule.event)();
            event.params.weightage = rule.weightage;
            let conditions = eval(rule.conditions)();
            let fact = eval(rule.fact);
            engine.addFact(rule.name, fact);
            engine.addRule({ name: rule.name, conditions, event, priority: rule.priority });
        });
        engine.on('success', function (event, almanac, ruleResult) {
            console.log('Success event:\n', ruleResult);
            counter += ruleResult.event.params.weightage;
            if (counter >= 0.2) {
                // engine.stop();
            }
        });
        engine.on('failure', function (event, almanac, ruleResult) {
            console.log('failure event:\n', ruleResult);
        });
        let fact = body;
        engine.run(fact).then(({ events }) => {
            console.log('all rules executed; the following events were triggered: ', events.map(result => JSON.stringify(result)));
            const ruleResponse = getRuleOutcomes(outcomes);
            const finalResponse = {
                success: true,
                response: ruleResponse,
                message: messages_1.Messages.SUCCESS,
                errorCode: error_codes_1.ErrorCodes.SUCCESS
            };
            return res.send(finalResponse);
        });
    }
}
function getRuleOutcomes(outcomes) {
    const finalStatus = getFinalStatus();
    let rogResults = {};
    rogResults['final_status'] = finalStatus;
    rogResults['log'] = outcomes;
    if ([constants_1.Constants.RED, constants_1.Constants.ORANGE].indexOf(finalStatus) != -1) {
        rogResults['is_rog'] = 1;
    }
    else {
        rogResults['is_rog'] = 0;
    }
    return rogResults;
}
function getFinalStatus() {
    let finalStatus;
    if (counter >= finalErrorThreshold) {
        finalStatus = constants_1.Constants.RED;
    }
    else {
        if (counter !== 0) {
            finalStatus = constants_1.Constants.ORANGE;
        }
        else {
            finalStatus = constants_1.Constants.GREEN;
        }
    }
    return finalStatus;
}
exports.default = new RuleValidation();
//# sourceMappingURL=handler.js.map
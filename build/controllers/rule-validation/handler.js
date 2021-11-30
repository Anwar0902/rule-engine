"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var _ = require('lodash');
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("../../utils/constants");
const messages_1 = require("../../utils/messages");
const error_codes_1 = require("../../utils/error-codes");
let { Engine } = require('json-rules-engine');
// let engine = _.clone(engine1);
// import ApiRequest from '../../apis/api-requests';
// https://express-validator.github.io/docs/validation-chain-api.html
// https://github.com/CacheControl/json-rules-engine/blob/master/docs/rules.md#string-and-numeric-operators
// https://github.com/express-validator/express-validator/issues/439
// const Util = require('../../helper/util');
// const util1 = new Util();
const ApiRequest = require('../../apis/api-requests');
const apiRequest = new ApiRequest();
const helper_1 = require("../../helper/helper");
const util_1 = require("../../helper/util");
const finalErrorThreshold = 1;
class RuleValidation {
    // async validate(req: Request, res: Response) {
    //     console.log("debug ", counter);
    //     const body: ValidateRequest = req.body;
    //     const rules = getRules();
    //     rules.forEach((rule, index) => {
    //         let event = eval(rule.event)();
    //         event.params.weightage = rule.weightage;
    //         let conditions = eval(rule.conditions)();
    //         let fact = eval(rule.fact);
    //         engine.addFact(rule.name, fact);
    //         engine.addRule({name : rule.name ,conditions, event, priority: rule.priority });
    //     })
    //     engine.on('success', function (event, almanac, ruleResult) {
    //         console.log('Success event:\n', ruleResult);
    //         counter += ruleResult.event.params.weightage;
    //         if(counter >= 1) {
    //             engine.stop();
    //         }
    //     });
    //     engine.on('failure', function (event, almanac, ruleResult) {
    //         console.log('failure event:\n', ruleResult);
    //     });
    //     let fact = body;
    //     engine.run(fact).then(({ events }) => {
    //       console.log('all rules executed; the following events were triggered: ', events.map(result => JSON.stringify(result)))
    //       const ruleResponse: RogResult = getRuleOutcomes(outcomes);
    //       const finalResponse: HttpResponse = {
    //           success: true,
    //           response: ruleResponse,
    //           message: Messages.SUCCESS,
    //           errorCode: ErrorCodes.SUCCESS
    //       }
    //       return res.send(finalResponse);
    //     });
    // }
    async validate1(req, res) {
        let engine1 = new Engine();
        let engine = _.clone(engine1);
        let outcomes = [];
        let counter = 0;
        console.log("debug ", counter);
        const body = req.body;
        const rules = (0, helper_1.getRules2)();
        rules.forEach((rule, index) => {
            if (index != 7)
                return;
            // console.log("rule----", rule);
            let event = eval(rule.event)();
            event.params.weightage = rule.weightage;
            let conditions = eval(rule.conditions)();
            let func = eval(rule.fact)();
            func.forEach((fun, index) => {
                if (index === func.length - 1) {
                    engine.addFact(rule.name, fun);
                }
                else {
                    engine.addFact(`${rule.name}_${index + 1}`, fun);
                }
            });
            // engine.addFact(rule.name, fact);
            engine.addRule({ name: rule.name, conditions, event, priority: rule.priority });
        });
        engine.on('success', function (event, almanac, ruleResult) {
            console.log('Success event:\n', ruleResult);
            counter += ruleResult.event.params.weightage;
            if (counter >= 1) {
                engine.stop();
            }
        });
        engine.on('failure', function (event, almanac, ruleResult) {
            console.log('failure event:\n', ruleResult);
        });
        engine.on('common_success', async function (event, almanac, ruleResult) {
            console.log('Success event:\n', event);
            const { name, outcome, reason_value, params } = event;
            let reason = reason_value;
            let mapResponse = params.map(async (param, index) => {
                const data = await almanac.factValue(`${param}`);
                console.log("factvalue ---- ", data, reason);
                reason.replace(`param${index + 1}`, data);
                console.log("factvalue ---- ", data, reason);
            });
            await Promise.all(mapResponse);
            let ruleOutcomes = {
                name,
                outcomes: outcome,
                reason_value: reason
            };
            outcomes.push(ruleOutcomes);
        });
        let fact = body;
        engine.run(fact).then(({ events }) => {
            console.log('all rules executed; the following events were triggered: ', events.map(result => JSON.stringify(result)));
            const ruleResponse = getRuleOutcomes(outcomes, counter);
            console.log("outcomes---", outcomes);
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
function getRuleOutcomes(outcomes, counter) {
    // const finalStatus: any = tryCatch(getFinalStatus);
    const finalStatus = getFinalStatus(counter);
    let rogResults = {};
    rogResults['status'] = finalStatus;
    rogResults['log'] = outcomes;
    console.log(finalStatus, constants_1.Constants.RED, constants_1.Constants.ORANGE);
    // if([Constants.RED, Constants.ORANGE ].indexOf(finalStatus) != -1 ){
    //     rogResults['is_rog'] = 1;
    // }else{
    //     rogResults['is_rog'] = 0;
    // }
    return rogResults;
}
function getFinalStatus(counter) {
    let finalStatus;
    // let x;
    // x.a.b = 23;
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
const create = (req, res) => {
    const body = req.body;
    const memberlogin = req.params['memberlogin'];
    const rule = (0, util_1.generateRule)(body, memberlogin);
    console.log("rules --- ", rule);
    // add data in db;
    fs_1.default.exists('rules.json', function (exists) {
        if (exists) {
            console.log("yes file exists");
            fs_1.default.readFile('rules.json', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    let rules = JSON.parse(data);
                    rules.push(rule);
                    let json = JSON.stringify(rules);
                    fs_1.default.writeFile('rules.json', json, () => { console.log("success write"); });
                }
            });
        }
        else {
            console.log("file not exists");
            let json = JSON.stringify([rule]);
            fs_1.default.writeFile('rules.json', json, () => {
                console.log("success write else");
            });
        }
    });
    return res.send("hello");
};
exports.create = create;
exports.default = new RuleValidation();
//# sourceMappingURL=handler.js.map
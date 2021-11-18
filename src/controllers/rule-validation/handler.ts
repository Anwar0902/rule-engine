import { check, validationResult, ValidationError, ValidationChain, Result } from 'express-validator'
import { Request, Response } from 'express'
import {StatusCodes} from "http-status-codes";
import { Constants } from '../../utils/constants'
import { RogResult } from '../../models/rule-validations'
import { ValidateRequest } from '../../models/request'
import { Messages } from '../../utils/messages'
import { ErrorCodes } from '../../utils/error-codes'
import { Response as HttpResponse } from '../../models/response'

let  {Engine}  = require('json-rules-engine');
let engine = new Engine();

// import ApiRequest from '../../apis/api-requests';

const Util = require('../../helper/util');
const util1 = new Util();

const ApiRequest = require('../../apis/api-requests');
const apiRequest = new ApiRequest();

import {getRules} from "../../helper/helper"

let counter: number = 0;
const finalErrorThreshold: number = 1;
let outcomes: Array<Object> = [];

class RuleValidation {

    async validate(req: Request, res: Response) {
        const body: ValidateRequest = req.body;

        const rules = getRules();

        rules.forEach((rule, index) => {
            let event = eval(rule.event)();
            event.params.weightage = rule.weightage;
            let conditions = eval(rule.conditions)();
            let fact = eval(rule.fact);
            engine.addFact(rule.name, fact);
            engine.addRule({name : rule.name ,conditions, event, priority: rule.priority });
        })

        engine.on('success', function (event, almanac, ruleResult) {
            console.log('Success event:\n', ruleResult);
            counter += ruleResult.event.params.weightage;
            if(counter >= 0.2) {
                // engine.stop();
            }
        });
        
        engine.on('failure', function (event, almanac, ruleResult) {
            console.log('failure event:\n', ruleResult);
        });

        let fact = body;

        engine.run(fact).then(({ events }) => {
          console.log('all rules executed; the following events were triggered: ', events.map(result => JSON.stringify(result)))
          const ruleResponse: RogResult = getRuleOutcomes(outcomes);
          const finalResponse: HttpResponse = {
              success: true,
              response: ruleResponse,
              message: Messages.SUCCESS,
              errorCode: ErrorCodes.SUCCESS
          }
          return res.send(finalResponse);
        });
    }

}

function getRuleOutcomes(outcomes) {
    const finalStatus: string = getFinalStatus();
    let rogResults: any = {};
    rogResults['final_status'] = finalStatus;
    rogResults['log'] = outcomes;
    if([Constants.RED, Constants.ORANGE ].indexOf(finalStatus) != -1 ){
        rogResults['is_rog'] = 1;
    }else{
        rogResults['is_rog'] = 0;
    }
    return rogResults;
}

function getFinalStatus() {
    let finalStatus: string;
    if(counter >= finalErrorThreshold){
        finalStatus = Constants.RED;
    }else{
        if(counter !== 0 ){
            finalStatus = Constants.ORANGE;
        }else{
            finalStatus = Constants.GREEN;
        }
    }
    return finalStatus;
}

export default new RuleValidation();
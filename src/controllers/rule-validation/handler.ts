import { check, validationResult, ValidationError, ValidationChain, Result } from 'express-validator'
import {StatusCodes} from "http-status-codes";
let { Engine } = require('json-rules-engine');
let engine = new Engine();

import ApiRequest from '../../apis/api-requests';

import Helper from "../../helper/helper"

class RuleValidation {

    apiData() {
        console.log("apidata");
        return "data from API";
    }

    async validate(req, res) {
        // console.log(this.apiData());
        return res.send("hello");
        // return "";
        let event = {
            type: 'FB_UNDER_AGE',
            params: {
              giftCard: 'amazon',
              value: 50
            }
          };
        
        
          let conditions = {
            all: [
              {
                fact: 'FB_UNDER_AGE',
                operator: 'equal',
                value: true,
                params: {
                    fact1: 'gender',
                    fact2: 'age',
                    fact3: 'country',
                    fact4: 'fbUnderage'
                  }
              }
            ]
          };
        
        engine.addRule({name: 'FB_UNDER_AGE' ,conditions, event, priority: 1 });
        let ruleFact = `(async function(params, almanac) {
            let data1 = await almanac.factValue(params.fact1);
            let data2 = await almanac.factValue(params.fact2);
            return (data1 == 'Male') ? (data2 >= 21) : (data2 >= 18);
        })`;
        let ruleFact1 = eval(ruleFact);
        engine.addFact('FB_UNDER_AGE', ruleFact1);

        let body = req.body;
        let event2 = {
            type: '3WAY_COUNTRY_MISMATCH',
            params: {
              giftCard: 'anwar',
              value: 500
            }
          };

          // console.log(body.conditions);
        //   let f = `(async function(params, almanac) {
              
        //       let data1 = await almanac.factValue(params.fact1);
        //       let data2 = await almanac.factValue(params.fact2);
        //       let data3 = await almanac.factValue(params.fact3);
        //       let type = params.fact4
        //       return (data1 == data2) && (data2 == data3);
        //     })`;
            engine.addFact('3WAY_COUNTRY_MISMATCH', eval(body.facts));
        let c = {
			all: [
			  {
			    fact: '3WAY_COUNTRY_MISMATCH',
			    operator: 'equal',
			    value: true,
			    params: {
				fact1: 'country',
				fact2: 'mobile_country',
				fact3: 'IP_country',
				fact4: 'mismatch'
			    }
			  }
			]
	    }

        let x = eval(body.conditions)();
        console.log(x);
        
        
        engine.addRule({name: '3WAY_COUNTRY_MISMATCH' ,conditions: x, event: event2, priority: 2 });

        engine.on('success', function (event, almanac, ruleResult) {
            // result[ruleResult.name] = ruleResult.result;
            // console.log(event);
            console.log('Success event:\n', event);
        });
        
        engine.on('failure', function (event, almanac, ruleResult) {
            console.log('failure event:\n', ruleResult);
        });

        let fact = {
            country : "India",
            mobile_country: "Inia",
            IP_country: "India",
            gender: "Female",
            age: 18
        }
        // run() returns a promise
        engine.run(fact).then(({ events }) => {
          console.log('all rules executed; the following events were triggered: ', events.map(result => JSON.stringify(result)))
        });

        
        // let body = req.body;
        // console.log("post for rules");
        // this.apiData();
        return res.send("");
        
        // const {apiRequest} = require("../../apis/api-requests");
        // let funct = body.funct;
        // let x = `(async function() {
    
        //     console.log("baba re baba");
        //     console.log(this);
            
        //     const payload = {
        //         "data" : {
        //             "type": "aadhaar",
        //             "number": "07b88de7-ec79-4a27-a207-9ce874b62725"
        //         }
        //     }
        //     const response = RuleValidation.apidata();
        //     // const response = await ApiRequest.apiRequest("get", "Post", "http://back1.shaadi.com/v1/profiles/digitalid/details", {}, payload)
        //     return response;
        // })`;
        
        // let data = eval(x);
        // const response = await data()
        // const payload = {
        //     "data" : {
        //         "type": "aadhaar",
        //         "number": "07b88de7-ec79-4a27-a207-9ce874b62725"
        //     }
        // }
        // const response = await apiRequest("get", "Post", "http://back1.shaadi.com/v1/profiles/digitalid/details", {}, payload)
        // return res.send(response);
    }

}

export default new RuleValidation();
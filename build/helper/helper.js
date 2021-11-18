"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
let ip_num;
const getRules = () => {
    return [
        {
            name: "3WAY_COUNTRY_MISMATCH",
            priority: 3,
            weightage: 0.1,
            description: "3WAY_COUNTRY_MISMATCH",
            status: "Active",
            type: "Profile Creation",
            conditions: ` ( () => {
                return {
                    all: [
                    {
                        fact: '3WAY_COUNTRY_MISMATCH',
                        operator: 'equal',
                        value: true,
                        params: {
                            fact1: 'country',
                            fact2: 'mobile_country',
                            fact3: 'IP_country',
                            fact4: '3WAY_COUNTRY_MISMATCH'
                        }
                    }
                    ]
                }
            })`,
            event: `( () => {
                return {
                    type: '3WAY_COUNTRY_MISMATCH',
                    params: {
                        name: '3WAY_COUNTRY_MISMATCH'
                    }
                }
            })`,
            fact: `(async function(params, almanac) {
    
                let data1 = await almanac.factValue(params.fact1);
                let data2 = await almanac.factValue(params.fact2);
                let data3 = await almanac.factValue(params.fact3);
                let type = params.fact4
                let resultOutcomes;
                if(!(data1 == data2 && data2 == data3))
                {
                    resultOutcomes = {
                        outcomes: "Warn",
                        reason: type,
                        reason_value: \` country mismatch :- \${data1}, \${data2}, \${data3} \`
                    };
                    outcomes.push(resultOutcomes);
                    return true;
                }
                return false;
            })`
        },
        {
            name: "FB_UNDER_AGE",
            priority: 2,
            weightage: 0.2,
            description: "FB_UNDER_AGE",
            status: "Active",
            type: "Profile Creation",
            conditions: ` ( () => {
                return {
                    all: [
                        {
                            fact: 'FB_UNDER_AGE',
                            operator: 'equal',
                            value: true,
                            params: {
                                fact1: 'gender',
                                fact2: 'age',
                                fact3: 'FB_UNDER_AGE'
                            }
                        }
                    ]
                }
            })`,
            event: `(() => {
                return {
                    type: 'FB_UNDER_AGE',
                    params: {
                        name: 'FB_UNDER_AGE'
                    }
                }
            })`,
            fact: `(async function(params, almanac) {
                let gender = await almanac.factValue(params.fact1);
                let age = await almanac.factValue(params.fact2);
                let type = params.fact3;
                let resultOutcomes;
                if((gender == 'Male' && age < 21) || (gender == 'Female' && age < 18) )
                {
                    resultOutcomes = {
                        outcomes: "Fail",
                        reason: type,
                        reason_value: \` Invalid Age \${age} and for Gender \${gender} \`
                    };
                    outcomes.push(resultOutcomes);
                    return true;
                }
                return false;
            })`
        },
        {
            name: "IP_COUNTRY",
            priority: 1,
            weightage: 0.6,
            description: "IP_COUNTRY",
            status: "Active",
            type: "Profile Creation",
            conditions: ` ( () => {
                return {
                    all: [
                        {
                            fact: 'IP_COUNTRY',
                            operator: 'equal',
                            value: true,
                            params: {
                                fact1: 'ip_country',
                                fact2: 'ip_address',
                                fact4: 'IP_COUNTRY'
                            }
                        }
                    ]
                }
            })`,
            event: `(() => {
                return {
                    type: 'IP_COUNTRY',
                    params: {
                        name: 'IP_COUNTRY'
                    }
                }
            })`,
            fact: `(async function(params, almanac) {
                let data1 = await almanac.factValue(params.fact1);
                let data2 = await almanac.factValue(params.fact2);
                console.log(data1, data2);
                const ApiRequest = require("../../apis/api-requests");
                const ApiRequest1 = new ApiRequest();

                let ip_temp = data2.split(".");
                let ip_num = ( 16777216 * ip_temp[0]) + ( 65536 * ip_temp[1]) + ( 256 * ip_temp[2] ) + parseInt(ip_temp[3]);
                
                let country_details = {};
                let url = \`http://back1.shaadi.com/v1/ip-country?beginning_ip_num=\$\{ip_num\}\`
                const ipResponse = await ApiRequest1.apiRequest("get", "Get", url, {});
                country_details["country_code"] = ipResponse && ipResponse.data && ipResponse.data.iso_3166_country_code;
                country_details["country_name"] = ipResponse && ipResponse.data && ipResponse.data.country_name;
                console.log(country_details);
                const lookupParams = {
                    'fieldset' : "rog_blocked_countries",
                    'fq'  	   : {
                        "rog_blocked_countries": {
                            "country":  country_details.country_name,
                            "type":"IpCountry"
                        }
                    }
                };
                const lookupUrl = \`http://back1.shaadi.com/v1/lookup?fieldset=\$\{lookupParams.fieldset}\&fq=\${encodeURIComponent(JSON.stringify(lookupParams.fq))}\`
                const lookupResponse = await ApiRequest1.apiRequest("get", "Get", lookupUrl, {});
                console.log(lookupResponse);
                let resultOutcomes;
                if(lookupResponse && lookupResponse.data && lookupResponse.data.rog_blocked_countries) {
                    resultOutcomes = {
                        outcomes: "Fail",
                        reason: type,

                        reason_value: \` Invalid Age \${age} and for Gender \${gender} \`
                    };
                    outcomes.push(resultOutcomes);
                    return true;
                }
                return false;
            })`
        }
    ];
};
exports.getRules = getRules;
//# sourceMappingURL=helper.js.map
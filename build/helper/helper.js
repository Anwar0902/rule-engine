"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules2 = exports.getRules = void 0;
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
            weightage: 1,
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
                        reason_value: \` Invalid Age \${age} for Gender \${gender} \`
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
                const ApiRequest1 = new ApiRequest()


                // let ip_temp = data2.split(".");
                // let ip_num = ( 16777216 * ip_temp[0]) + ( 65536 * ip_temp[1]) + ( 256 * ip_temp[2] ) + parseInt(ip_temp[3]);
                
                
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
                        reason_value: \` blocked Ip Address \${data2} \`
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
const getRules2 = () => {
    return [
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
            fact: `(() => {
                return [
                    function (params) {
                        let ip_temp = params.split(".");
                        let ip_num = ( 16777216 * ip_temp[0]) + ( 65536 * ip_temp[1]) + ( 256 * ip_temp[2] ) + parseInt(ip_temp[3]);
                        return ip_num;
                    },

                    async function(params, almanac) {
                        const ApiRequest = require("../../apis/api-requests");
                        const ApiRequest1 = new ApiRequest();

                        let country_details = {};
                        let url = \`http://back1.shaadi.com/v1/ip-country?beginning_ip_num=\${params\}\`
                        const ipResponse = await ApiRequest1.apiRequest("get", "Get", url, {});
                        country_details["country_code"] = ipResponse && ipResponse.data && ipResponse.data.iso_3166_country_code;
                        country_details["country_name"] = ipResponse && ipResponse.data && ipResponse.data.country_name;
                        console.log(country_details);
                        return country_details;
                    },
                    
                    async function(params, almanac) {
                        const ApiRequest = require("../../apis/api-requests");
                        const ApiRequest1 = new ApiRequest();

                        const lookupParams = {
                            'fieldset' : "rog_blocked_countries",
                            'fq'  	   : {
                                "rog_blocked_countries": {
                                    "country":  params,
                                    "type":"IpCountry"
                                }
                            }
                        };
                        const lookupUrl = \`http://back1.shaadi.com/v1/lookup?fieldset=\${lookupParams.fieldset}&fq=\${encodeURIComponent(JSON.stringify(lookupParams.fq))}\`
                        const lookupResponse = await ApiRequest1.apiRequest("get", "Get", lookupUrl, {});
                        console.log(lookupResponse);
                        return lookupResponse
                    },

                    async function(params, almanac) {
                        let data1 = await almanac.factValue(params.fact1);
                        let data2 = await almanac.factValue(params.fact2);
                        let type = params.fact4

                        let ip_num = await almanac.factValue('IP_COUNTRY_1', data2);
                        let country_details = await almanac.factValue('IP_COUNTRY_2', ip_num);
                        let lookupResponse = await almanac.factValue('IP_COUNTRY_3', data1);
                        
                        let resultOutcomes;
                        if(lookupResponse && lookupResponse.data && lookupResponse.data.rog_blocked_countries) {
                            resultOutcomes = {
                                outcomes: "Fail",
                                reason: type,
                                reason_value: \` Blocked IpAddress \${data2} \`
                            };
                            outcomes.push(resultOutcomes);
                            return true;
                        }
                        return false;
                    },
                ]
            })`
        },
        {
            name: "IP_PTNR_PASSWORD",
            priority: 1,
            weightage: 0.6,
            description: "IP_PTNR_PASSWORD rule",
            status: "Active",
            type: "Profile Creation",
            conditions: ` ( () => {
                return {
                    all: [
                        {
                            fact: 'IP_PTNR_PASSWORD',
                            operator: 'equal',
                            value: true,
                            params: {
                                fact1: 'affiliate_login',
                                fact2: 'ip_address',
                                fact3: 'enc_pass',
                                fact4: 'IP_PTNR_PASSWORD'
                            }
                        }
                    ]
                }
            })`,
            event: `(() => {
                return {
                    type: 'IP_PTNR_PASSWORD',
                    params: {
                        name: 'IP_PTNR_PASSWORD'
                    }
                }
            })`,
            fact: `(() => {
                return [
                    function (params) {
                        if(params.affiliate_login && params.ip_address && params.enc_pass && (['Satyanet','null','direct_homepage','noptnr','direct'].indexOf(params.affiliate_login) == -1))
                            return false;
                        return true;
                    },
                    
                    async function(params, almanac) {
                        const ApiRequest = require("../../apis/api-requests");
                        const ApiRequest1 = new ApiRequest();

                        console.log("params---- ", params);
                        const lookupParams = {
                            'fieldset' : "sixty_days_view",
                            'fq'  	   : {
                                'sixty_days_view': {
                                    'affiliate_login' 	:  params.affiliate_login,
                                    'ip' 				:  params.ip_address,
                                    'password'		    :  params.enc_pass
                                }
                            }
                        };
                        const lookupUrl = \`http://back1.shaadi.com/v1/rog?fieldset=\${lookupParams.fieldset}&fq=\${encodeURIComponent(JSON.stringify(lookupParams.fq))}\`
                        const lookupResponse = await ApiRequest1.apiRequest("get", "Get", lookupUrl, {});
                        return (lookupResponse && lookupResponse.sixty_days_view && lookupResponse.sixty_days_view) ? lookupResponse.sixty_days_view : {};
                    },

                    async function(params, almanac) {
                        let affiliate_login = await almanac.factValue(params.fact1);
                        let ip_address = await almanac.factValue(params.fact2);
                        let enc_pass = await almanac.factValue(params.fact3);
                        let type = params.fact4

                        let func1Response = await almanac.factValue('IP_PTNR_PASSWORD_1', {affiliate_login, ip_address, enc_pass});
                        
                        if(!func1Response)
                            return false;

                        let func2Response = await almanac.factValue('IP_PTNR_PASSWORD_2', {affiliate_login, ip_address, enc_pass});
                        let resultOutcomes;
                        if(func2Response && func2Response.data) {
                            console.log("func2Response--- ", func2Response, typeof func2Response);
                            resultOutcomes = {
                                outcomes: "Warn",
                                reason: type,
                                reason_value: \` affiliate_login error \${affiliate_login} \`
                            };
                            outcomes.push(resultOutcomes);
                            return true;
                        }
                        return false;
                    },
                ]
            })`
        },
        {
            name: "THREE_WAY_COUNTRY_MISMATCH",
            priority: 1,
            weightage: 0.6,
            description: "THREE_WAY_COUNTRY_MISMATCH rule",
            status: "Active",
            type: "Profile Creation",
            conditions: ` ( () => {
                return {
                    all: [
                        {
                            fact: 'THREE_WAY_COUNTRY_MISMATCH',
                            operator: 'equal',
                            value: true,
                            params: {
                                fact1: 'ip_country',
                                fact2: 'member_country',
                                fact3: 'mobile_country',
                                fact4: 'THREE_WAY_COUNTRY_MISMATCH'
                            }
                        }
                    ]
                }
            })`,
            event: `(() => {
                return {
                    type: 'THREE_WAY_COUNTRY_MISMATCH',
                    params: {
                        name: 'THREE_WAY_COUNTRY_MISMATCH'
                    }
                }
            })`,
            fact: `(() => {
                return [
                    function (params) {
                        if((params.ip_country != params.member_country )&& (params.member_country != params.mobile_country))
                            return true;
                        return false;
                    },

                    async function(params, almanac) {
                        let ip_country = await almanac.factValue(params.fact1);
                        let member_country = await almanac.factValue(params.fact2);
                        let mobile_country = await almanac.factValue(params.fact3);
                        let type = params.fact4

                        let func1Response = await almanac.factValue('THREE_WAY_COUNTRY_MISMATCH_1', {ip_country, member_country, mobile_country});

                        let resultOutcomes;
                        if(func1Response) {
                            resultOutcomes = {
                                outcomes: "Warn",
                                reason: type,
                                reason_value: \` country mismatch :- \${ip_country}, \${member_country}, \${mobile_country} \`
                            };
                            outcomes.push(resultOutcomes);
                            return true;
                        }
                        return false;
                    },
                ]
            })`
        },
        {
            name: "SPECIAL_CASE",
            priority: 1,
            weightage: 0.6,
            description: "SPECIAL_CASE rule",
            status: "Active",
            type: "Profile Creation",
            conditions: ` ( () => {
                return {
                    all: [
                        {
                            fact: 'special_cases',
                            operator: 'notEqual',
                            value: 'None',
                        }
                    ]
                }
            })`,
            event: `(() => {
                return {
                    type: 'SPECIAL_CASE',
                    params: {
                        name: 'SPECIAL_CASE',
                        outcomes: 'Warn',
                        reason_value: 'specialcases',
                        isAdded: false
                    }
                }
            })`,
            fact: `(() => {
                return [];
            })`
        },
        {
            name: "POSTED_BY",
            priority: 1,
            weightage: 0.6,
            description: "POSTED_BY rule",
            status: "Active",
            type: "Profile Creation",
            conditions: ` ( () => {
                return {
                    all: [
                        {
                            fact: 'posted_by',
                            operator: 'equal',
                            value: 'friend'
                        }
                    ]
                }
            })`,
            event: `(() => {
                return {
                    type: 'POSTED_BY',
                    params: {
                        name: 'POSTED_BY',
                        outcomes: 'Warn',
                        reason_value: 'posted by'
                    }
                }
            })`,
            fact: `(() => {
                return [];
            })`
        },
        {
            name: "POSTED_BY_FRIEND",
            priority: 1,
            weightage: 0.6,
            description: "POSTED_BY_FRIEND rule",
            status: "Active",
            type: "Profile Creation",
            conditions: ` ( () => {
                return {
                    all: [
                        {
                            fact: 'posted_by',
                            operator: 'equal',
                            value: 'friend'
                        },
                        {
                            fact: 'gender',
                            operator: 'equal',
                            value: 'male'
                        }
                    ]
                }
            })`,
            event: `(() => {
                return {
                    type: 'POSTED_BY_FRIEND',
                    params: {
                        name: 'POSTED_BY_FRIEND',
                        outcomes: 'Warn',
                        reason_value: 'POSTED_BY_FRIEND'
                    }
                }
            })`,
            fact: `(() => {
                return [];
            })`
        },
        {
            name: "INVALID_MOBILE_NUMBER",
            priority: 1,
            weightage: 0.6,
            description: "INVALID_MOBILE_NUMBER rule",
            status: "Active",
            type: "Profile Creation",
            conditions: ` ( () => {
                return {
                    all: [
                        {
                            fact: 'INVALID_MOBILE_NUMBER',
                            operator: 'equal',
                            value: true,
                            params: {
                                fact1: 'mobile',
                                fact2: 'INVALID_MOBILE_NUMBER'
                            }
                        }
                    ]
                }
            })`,
            event: `(() => {
                return {
                    type: 'INVALID_MOBILE_NUMBER',
                    params: {
                        name: 'INVALID_MOBILE_NUMBER'
                    }
                }
            })`,
            fact: `(() => {
                return [
                    async function(params, almanac) {
                        const ApiRequest = require("../../apis/api-requests");
                        const ApiRequest1 = new ApiRequest();

                        const lookupParams = {
                            'fieldset' : "rog_blocked_phone_numbers",
                            'fq'  	   : {
                                'rog_blocked_phone_numbers': {
                                    'phone_no' 	:  params.mobile
                                }
                            }
                        };
                        const lookupUrl = \`http://back1.shaadi.com/v1/rog?fieldset=\${lookupParams.fieldset}&fq=\${encodeURIComponent(JSON.stringify(lookupParams.fq))}\`
                        const lookupResponse = await ApiRequest1.apiRequest("get", "Get", lookupUrl, {});
                        return (lookupResponse && lookupResponse.rog_blocked_phone_numbers) ? lookupResponse.rog_blocked_phone_numbers : {};
                    },

                    async function(params, almanac) {
                        let mobile = await almanac.factValue(params.fact1);
                        let type = params.fact2;

                        let func1Response = await almanac.factValue('INVALID_MOBILE_NUMBER_1', {mobile});
                        let resultOutcomes;
                        if(func1Response && func1Response.data) {
                            resultOutcomes = {
                                outcomes: "Warn",
                                reason: type,
                                reason_value: \` Invalid Mobile Number \${mobile} \`
                            };
                            outcomes.push(resultOutcomes);
                            return true;
                        }
                        return false;
                    },
                ]
            })`
        },
        {
            name: "ROG_HONEYPOT",
            priority: 1,
            weightage: 0.6,
            description: "ROG_HONEYPOT rule",
            status: "Active",
            type: "Profile Creation",
            conditions: ` ( () => {
                return {
                    all: [
                        {
                            fact: 'personal_values',
                            operator: 'in',
                            value: ['', null, undefined],
                        }
                    ]
                }
            })`,
            event: `(() => {
                return {
                    type: 'common_success',
                    params: {
                        name: 'ROG_HONEYPOT',
                        outcome: 'Warn',
                        reason_value: 'Got Personal Values :-  param1',
                        params: ['personal_values']
                    }
                }
            })`,
            fact: `(() => {
                return [];
            })`
        },
    ];
};
exports.getRules2 = getRules2;
//# sourceMappingURL=helper.js.map
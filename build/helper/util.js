"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padding = exports.getRecorddate = exports.generateRule = void 0;
const ApiRequest = require("../apis/api-requests");
const ApiRequest1 = new ApiRequest();
const generateRule = (rule, memberlogin) => {
    const conditions = `(() => {
        return \`${JSON.stringify(rule.conditions)}\`
    })`;
    const events = `(() => {
        return {
            type : ${rule.name},
            params: {
                name: ${rule.name}
            }
        }
    })`;
    return {
        name: rule.name,
        type: rule.type,
        weightage: rule.weightage,
        precedence: rule.precedence,
        description: rule.description || '',
        facts: rule.facts,
        additional_info: rule.additional_info || '',
        current_version: 1,
        created_by: memberlogin,
        status: 'Active',
        conditions,
        events
    };
};
exports.generateRule = generateRule;
const getRecorddate = (date) => {
    const now = date ? date : new Date();
    let year = "" + now.getFullYear();
    let month = "" + (0, exports.padding)(now.getMonth() + 1);
    let day = "" + (0, exports.padding)(now.getDate());
    let hour = "" + (0, exports.padding)(now.getHours());
    let minute = "" + (0, exports.padding)(now.getMinutes());
    let second = "" + (0, exports.padding)(now.getSeconds());
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
};
exports.getRecorddate = getRecorddate;
const padding = (data) => {
    return data > 10 ? data : "0" + data;
};
exports.padding = padding;
//# sourceMappingURL=util.js.map
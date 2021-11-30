import { json } from "express";
import { body } from "express-validator";

const ApiRequest = require("../apis/api-requests");
const ApiRequest1 = new ApiRequest();

export const generateRule = (rule, memberlogin) => {
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
    }
}

export const getRecorddate = (date : Date) => {
    const now = date ? date : new Date();
    let year = "" + now.getFullYear();
    let month = "" + padding(now.getMonth() + 1);
    let day = "" + padding(now.getDate());
    let hour = "" + padding(now.getHours());
    let minute = "" + padding(now.getMinutes());
    let second = "" + padding(now.getSeconds());
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

export const padding = (data) => {
    return data > 10 ? data : "0" + data;
}
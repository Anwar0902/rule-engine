const express = require("express");

import { check, validationResult, ValidationError, ValidationChain, Result, oneOf } from 'express-validator'
import {StatusCodes} from "http-status-codes";

import {createRuleValidator, validateRequest, validateRuleValidator, data, abcV} from "../middlewares/validations"
import RuleValidation from "../controllers/rule-validation/handler";
import { create } from "../controllers/rule-validation/handler";
import { ageRange } from '../utils/koautils'

const routes = new express.Router();

let x = [
	check('ip_country').notEmpty().withMessage('ip_country is required'),
	check('ip_address').notEmpty().withMessage('ip_address is required'),
    check('country').notEmpty().withMessage('country is required'),
	check('mobile_country').notEmpty().withMessage('mobile_country is required'),
    check('IP_country').notEmpty().withMessage('IP_country is required'),
    check('gender').notEmpty().withMessage('gender is required'),
	check('age').notEmpty().withMessage('age is required')
                .bail()
                .not().isString().withMessage('Age must be Integer')
                .isInt({min: ageRange.minAge, max: ageRange.maxAge}).withMessage(`Age must be between ${ageRange.minAge} and ${ageRange.maxAge}`)
]

let y = [
	check('ip_address').custom((value, {req})=> {
        let ipc = req.body.ip_country;
        let env = req.body.env;
        console.log(env, ipc);
        
        if(env === 'shaadi' && !ipc) {
            throw new Error('ip_country is required')
        } else {
            return true;
        }
    }),
    check('country').notEmpty().withMessage('country is required'),
	check('mobile_country').notEmpty().withMessage('mobile_country is required'),
    check('IP_country').notEmpty().withMessage('IP_country is required'),
    check('gender').notEmpty().withMessage('gender is required'),
	check('age').notEmpty().withMessage('age is required')
                .bail()
                .not().isString().withMessage('Age must be Integer')
]

let z = true ? x : y;
// console.log("z---", z);

let t = [
	check('country').notEmpty().withMessage('country is required')
]

let r = [
	check('ip_country').notEmpty().withMessage('ip_country is required')
]


// routes.post("/:memberlogin", createRuleValidator(), validateRequest, RuleValidation.create);
routes.post("/validate", oneOf([t, r]), validateRequest, RuleValidation.validate1);
routes.post("/abc", createRuleValidator(), validateRequest, create);
export default routes;
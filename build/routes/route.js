"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const express_validator_1 = require("express-validator");
const validations_1 = require("../middlewares/validations");
const handler_1 = __importDefault(require("../controllers/rule-validation/handler"));
const handler_2 = require("../controllers/rule-validation/handler");
const koautils_1 = require("../utils/koautils");
const routes = new express.Router();
let x = [
    (0, express_validator_1.check)('ip_country').notEmpty().withMessage('ip_country is required'),
    (0, express_validator_1.check)('ip_address').notEmpty().withMessage('ip_address is required'),
    (0, express_validator_1.check)('country').notEmpty().withMessage('country is required'),
    (0, express_validator_1.check)('mobile_country').notEmpty().withMessage('mobile_country is required'),
    (0, express_validator_1.check)('IP_country').notEmpty().withMessage('IP_country is required'),
    (0, express_validator_1.check)('gender').notEmpty().withMessage('gender is required'),
    (0, express_validator_1.check)('age').notEmpty().withMessage('age is required')
        .bail()
        .not().isString().withMessage('Age must be Integer')
        .isInt({ min: koautils_1.ageRange.minAge, max: koautils_1.ageRange.maxAge }).withMessage(`Age must be between ${koautils_1.ageRange.minAge} and ${koautils_1.ageRange.maxAge}`)
];
let y = [
    (0, express_validator_1.check)('ip_address').custom((value, { req }) => {
        let ipc = req.body.ip_country;
        let env = req.body.env;
        console.log(env, ipc);
        if (env === 'shaadi' && !ipc) {
            throw new Error('ip_country is required');
        }
        else {
            return true;
        }
    }),
    (0, express_validator_1.check)('country').notEmpty().withMessage('country is required'),
    (0, express_validator_1.check)('mobile_country').notEmpty().withMessage('mobile_country is required'),
    (0, express_validator_1.check)('IP_country').notEmpty().withMessage('IP_country is required'),
    (0, express_validator_1.check)('gender').notEmpty().withMessage('gender is required'),
    (0, express_validator_1.check)('age').notEmpty().withMessage('age is required')
        .bail()
        .not().isString().withMessage('Age must be Integer')
];
let z = true ? x : y;
// console.log("z---", z);
let t = [
    (0, express_validator_1.check)('country').notEmpty().withMessage('country is required')
];
let r = [
    (0, express_validator_1.check)('ip_country').notEmpty().withMessage('ip_country is required')
];
// routes.post("/:memberlogin", createRuleValidator(), validateRequest, RuleValidation.create);
routes.post("/validate", (0, express_validator_1.oneOf)([t, r]), validations_1.validateRequest, handler_1.default.validate1);
routes.post("/abc", (0, validations_1.createRuleValidator)(), validations_1.validateRequest, handler_2.create);
exports.default = routes;
//# sourceMappingURL=route.js.map
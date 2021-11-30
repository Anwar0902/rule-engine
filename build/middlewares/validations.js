"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.abcV = exports.data = exports.validateRuleValidator = exports.createRuleValidator = exports.expressValidator = void 0;
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
const expressValidator = (req) => {
    const errors = (0, express_validator_1.validationResult)(req);
    const messages = [];
    if (!errors.isEmpty()) {
        for (const i of errors.array()) {
            messages.push(i);
        }
    }
    return messages;
};
exports.expressValidator = expressValidator;
const validateCondition = (condition) => {
    console.log("codition --- ", condition);
    return true;
};
const createRuleValidator = () => [
    (0, express_validator_1.check)('name').isString().notEmpty(),
    (0, express_validator_1.check)('type').isString().withMessage("type must be string").bail().notEmpty().withMessage("type must not be empty"),
    (0, express_validator_1.check)('weightage').isFloat().notEmpty().custom(weightage => {
        if (weightage > 0 && weightage <= 1)
            return true;
        throw new Error("weightage value must be between 0 and 1");
    }),
    (0, express_validator_1.check)('precedence').isInt().notEmpty(),
    (0, express_validator_1.check)('description').isString().notEmpty(),
    (0, express_validator_1.check)('additional_info').isString().optional({ nullable: true }),
    (0, express_validator_1.check)('conditions').isObject().withMessage('conditions must be object'),
    (0, express_validator_1.check)('conditions.*').custom(condition => {
        return validateCondition(condition);
    }),
    (0, express_validator_1.check)('facts').notEmpty().isArray(),
    (0, express_validator_1.check)('facts[*]').isString().notEmpty().custom(fact => {
        let factFunction = eval(fact);
        if (typeof factFunction === 'function')
            return true;
        throw new Error("Facts value must be function");
    })
];
exports.createRuleValidator = createRuleValidator;
const validateRuleValidator = () => [
    (0, express_validator_1.check)('ip_country').notEmpty().withMessage('ip_country is required'),
    (0, express_validator_1.check)('ip_address').notEmpty().withMessage('ip_address is required'),
    (0, express_validator_1.check)('country').notEmpty().withMessage('country is required'),
    (0, express_validator_1.check)('mobile_country').notEmpty().withMessage('mobile_country is required'),
    (0, express_validator_1.check)('IP_country').notEmpty().withMessage('IP_country is required'),
    (0, express_validator_1.check)('gender').notEmpty().withMessage('gender is required'),
    (0, express_validator_1.check)('age').notEmpty().withMessage('age is required')
        .not().isString().withMessage('Age must be Integer')
];
exports.validateRuleValidator = validateRuleValidator;
const data = (req, res, next) => {
    const env = req.body.env;
    console.log("env  ", env);
    next();
    return [
        (0, express_validator_1.check)('ip_country').notEmpty().withMessage('ip_country is required'),
        (0, express_validator_1.check)('ip_address').notEmpty().withMessage('ip_address is required'),
        (0, express_validator_1.check)('country').notEmpty().withMessage('country is required'),
        (0, express_validator_1.check)('mobile_country').notEmpty().withMessage('mobile_country is required'),
        (0, express_validator_1.check)('IP_country').notEmpty().withMessage('IP_country is required'),
        (0, express_validator_1.check)('gender').notEmpty().withMessage('gender is required'),
        (0, express_validator_1.check)('age').notEmpty().withMessage('age is required')
            .not().isString().withMessage('Age must be Integer')
    ];
};
exports.data = data;
const abcV = () => [
    (0, express_validator_1.check)('name').notEmpty().withMessage('name is required'),
    (0, express_validator_1.check)("facts").isArray().notEmpty().bail(),
    (0, express_validator_1.check)("facts[*].age").isNumeric().custom(d => {
        if (d < 10)
            throw Error("age less than 10");
        else
            return true;
    })
];
exports.abcV = abcV;
const validateRequest = (req, res, next) => {
    console.log("abba");
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ error: errors.array() });
        return;
    }
    next();
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validations.js.map
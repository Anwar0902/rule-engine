"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.createRuleValidator = exports.expressValidator = void 0;
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
const createRuleValidator = () => [
    (0, express_validator_1.check)('name').notEmpty().withMessage('name is required'),
    (0, express_validator_1.check)('type').notEmpty().withMessage('type is not valid')
];
exports.createRuleValidator = createRuleValidator;
const validateRequest = (req, res, next) => {
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
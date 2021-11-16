import { Request } from 'express'
import { check, validationResult, ValidationError, ValidationChain, Result } from 'express-validator'
import {StatusCodes} from "http-status-codes";


export const expressValidator = (req: Request): ValidationError[] => {
	const errors: Result<ValidationError> = validationResult(req)

	const messages: ValidationError[] = []
	if (!errors.isEmpty()) {
		for (const i of errors.array()) {
			messages.push(i)
		}
	}
	return messages
}

export const createRuleValidator = (): ValidationChain[] => [
	check('name').notEmpty().withMessage('name is required'),
	check('type').notEmpty().withMessage('type is not valid')
]

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ error: errors.array() });
    return;
    }
    next();
}
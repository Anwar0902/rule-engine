import { Request, Response } from 'express'
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

const validateCondition = (condition) => {
    console.log("codition --- ", condition);
    
    return true;
}

export const createRuleValidator = (): ValidationChain[] => [
	check('name').isString().notEmpty(),
	check('type').isString().withMessage("type must be string").bail().notEmpty().withMessage("type must not be empty"),
    check('weightage').isFloat().notEmpty().custom(weightage => {
        if(weightage > 0 && weightage <= 1)
            return true;
        throw new Error("weightage value must be between 0 and 1");
    }),
	check('precedence').isInt().notEmpty(),
    check('description').isString().notEmpty(),
	check('additional_info').isString().optional({nullable: true}),
    check('conditions').isObject().withMessage('conditions must be object'),
    check('conditions.*').custom(condition => {
        return validateCondition(condition);
    }),
	check('facts').notEmpty().isArray(),
    check('facts[*]').isString().notEmpty().custom(fact => {
        let factFunction = eval(fact);
        if(typeof factFunction === 'function')
            return true;
        throw new Error("Facts value must be function");
    })
]

export const validateRuleValidator = (): ValidationChain[] => [
	check('ip_country').notEmpty().withMessage('ip_country is required'),
	check('ip_address').notEmpty().withMessage('ip_address is required'),
    check('country').notEmpty().withMessage('country is required'),
	check('mobile_country').notEmpty().withMessage('mobile_country is required'),
    check('IP_country').notEmpty().withMessage('IP_country is required'),
    check('gender').notEmpty().withMessage('gender is required'),
	check('age').notEmpty().withMessage('age is required')
                .not().isString().withMessage('Age must be Integer')
]

export const data = (req, res, next) => {
    const env = req.body.env;
    console.log("env  ", env);
    next();
    return [
        check('ip_country').notEmpty().withMessage('ip_country is required'),
        check('ip_address').notEmpty().withMessage('ip_address is required'),
        check('country').notEmpty().withMessage('country is required'),
        check('mobile_country').notEmpty().withMessage('mobile_country is required'),
        check('IP_country').notEmpty().withMessage('IP_country is required'),
        check('gender').notEmpty().withMessage('gender is required'),
        check('age').notEmpty().withMessage('age is required')
                    .not().isString().withMessage('Age must be Integer')
    ]
}

export const abcV = (): ValidationChain[] => [
	check('name').notEmpty().withMessage('name is required'),
	check("facts").isArray().notEmpty().bail(),
    check("facts[*].age").isNumeric().custom(d => {
        if(d < 10)
             throw Error("age less than 10");
        else 
            return true
    })
]

export const validateRequest = (req: Request, res: Response, next: any) => {
    console.log("abba");
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ error: errors.array() });
    return;
    }
    next();
}
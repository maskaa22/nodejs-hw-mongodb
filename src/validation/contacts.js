import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contactname should be a string',
    'string.min': 'Contactname should have at least {#limit} characters',
    'string.max': 'Contactname should have at most {#limit} characters',
    'any.required': 'Contactname is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'PhoneNumber should be a string',
    'string.min': 'PhoneNumber should have at least {#limit} characters',
    'string.max': 'PhoneNumber should have at most {#limit} characters',
    'any.required': 'PhoneNumber is required',
  }),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required().messages({
    'string.base': 'ContactType should be a string',
    'string.min': 'ContactType should have at least {#limit} characters',
    'string.max': 'ContactType should have at most {#limit} characters',
    'any.required': 'ContactType is required',
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

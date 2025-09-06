import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

const extension = (joi: any) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value: string, helpers: any) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error('string.escapeHTML', { value });
        return clean;
      }
    }
  }
});

const ExtendedJoi = Joi.extend(extension);

export const campgroundSchema = ExtendedJoi.object({
  title: ExtendedJoi.string().required().escapeHTML(),
  price: ExtendedJoi.number().required().min(0),
  location: ExtendedJoi.string().required().escapeHTML(),
  description: ExtendedJoi.string().required().escapeHTML(),
});

export const reviewSchema = ExtendedJoi.object({
  rating: ExtendedJoi.number().required().min(1).max(5),
  body: ExtendedJoi.string().required().escapeHTML(),
});

export const userSchema = ExtendedJoi.object({
  username: ExtendedJoi.string().required().min(3).max(30).escapeHTML(),
  email: ExtendedJoi.string().email().required(),
  password: ExtendedJoi.string().required().min(6),
});
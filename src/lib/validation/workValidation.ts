import * as BaseJoi from 'joi';
import * as JoiExtension from 'joi-date-extensions';

const Joi = BaseJoi.extend(JoiExtension);

const workHistoryValidation = (schema) => {
  const workHistorySchema = {
    month: Joi.date().format('YYYY-MM'),
  };

  const validate = Joi.validate(schema, workHistorySchema);
  return validate;
};

export {
  workHistoryValidation,
};

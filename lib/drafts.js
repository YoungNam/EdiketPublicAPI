import { Router } from 'express';
import _ from 'lodash';
import Joi from 'joi';
import request from 'superagent';
import { INVALID_SCHEMA } from './constants/errors';
import { DRAFT_URL } from './constants/config';

const router = new Router();
const uploadRequestSchema = Joi.object().keys({
  content: Joi.string().required(),
  message: Joi.string(),
  category_purpose: Joi.string(),
  category_type: Joi.string(),
  callback: Joi.string().uri(),
  user_id: Joi.string(),
  custom_data: Joi.string(),
});

router.post('/drafts/', (req, res) => {
  const body = Joi.validate(req.body, uploadRequestSchema);
  if (body.error) {
    return res.status(400).json(_.extend({
      status: 400,
      ...INVALID_SCHEMA,
    }, {
      message: body.error.details[0].message,
    }));
  }

  request
    .post(DRAFT_URL)
    .send(body.value)
    .end((err, response) => {
      console.log(response.statusCode);
      console.log(response.body);
    });

  res.json({
    message: 'created!!',
  });
});

router.get('/drafts/', (req, res) => {
  res.json({
    message: 'fetched!!',
  });
});

export default router;

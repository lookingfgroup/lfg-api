import Joi from "joi";
import type { ParameterizedContext } from "koa";

import { getValidatedInput } from "@/utils/request";
import { ValidationError } from "@/exceptions";
import { UNEXPECTED_ERROR } from "@/errors/index.errors";
import type { QueryParams } from "@/types/misc";
import { pageValidator, sortOrderValidator } from "@/utils/validators";
import {
  deleteNotification,
  getNotification,
  getNotifications,
  updateNotification,
} from "@/db/notification.db";
import { UpdateNotificationPayload } from "@/types/notifications";

export const getAll = async (ctx: ParameterizedContext) => {
  const payload = getValidatedInput<QueryParams>(ctx.request.query, {
    page: pageValidator,
    sortOrder: sortOrderValidator,
    sortField: Joi.string().required(),
  });

  ctx.body = await getNotifications(payload, ctx.user!.id);
};

export const getDetails = async (ctx: ParameterizedContext) => {
  const payload = getValidatedInput<{ id: string }>(ctx.params, {
    id: Joi.string().required(),
  });

  ctx.body = await getNotification(payload.id);
};

export const update = async (ctx: ParameterizedContext) => {
  const request = getValidatedInput<UpdateNotificationPayload>(
    { ...ctx.params, ...ctx.request.body },
    { id: Joi.string().max(256).required(), read: Joi.boolean().required() },
  );

  const updated = await updateNotification(request);

  if (!updated) {
    throw new ValidationError(UNEXPECTED_ERROR);
  }

  ctx.status = 200;
  ctx.body = updated;
};

export const remove = async (ctx: ParameterizedContext) => {
  const payload = getValidatedInput<{ id: string }>(ctx.params, {
    id: Joi.string().required(),
  });

  await deleteNotification(payload.id, ctx.user!.id);
  ctx.body = "OK";
};

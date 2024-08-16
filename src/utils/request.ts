import Joi from "joi";

import { ValidationError } from "@/exceptions";
import { INVALID_PARAMS } from "@/errors/auth";
import { NO_PARAMS } from "@/errors";

export const getValidatedInput = async <T>(
  payload: Record<string, any>,
  schema: Joi.PartialSchemaMap,
) => {
  if (!Object.keys(payload).length) {
    throw new ValidationError(NO_PARAMS);
  }

  const { value, error } = Joi.object<T>(schema).validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    console.log("aquo? ");
    throw new ValidationError({
      ...INVALID_PARAMS,
      errors: error.details.map((item) => {
        return { field: item.path.join("."), error: item.message };
      }),
    });
  }

  return value;
};

export const sanitizeInput = (input: any) => {
  if (!input) {
    return "";
  }

  input = input.toString().trim();

  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return input.replace(/[&<>"'/]/gi, (match: string) => map[match]);
};

export const desanitizeInput = (input: any) => {
  if (!input) {
    return "";
  }

  input = input.toString().trim();

  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#x27;": "'",
    "&#x2F;": "/",
  };

  return input.replace(
    /(&amp;)|(&lt;)|(&gt;)|(&quot)|(&#x27;)|(&#x2F;)/gi,
    (match: string) => map[match],
  );
};

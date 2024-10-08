import { and, eq } from "drizzle-orm";

import { db } from ".";
import { getOrder } from "./utils";
import { notifications } from "./schemas/notifications.schema";
import type { QueryParams } from "@/types/misc";
import type { BaseNotification, UpdateNotificationPayload } from "@/types/notifications";
import { users } from "./schemas/users.schema";

const PAGE_SIZE = 25;

export const getNotification = async (id: string) => {
  const result = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      payload: notifications.payload,
      read: notifications.read,
      createdAt: notifications.createdAt,
      user: {
        id: users.id,
        name: users.name,
        photo: users.picUrl,
      },
    })
    .from(notifications)
    .innerJoin(users, eq(users.id, notifications.userId))
    .where(eq(notifications.id, id))
    .limit(1);

  return result.length ? result[0] : null;
};

export const getNotifications = async (
  { page, sortField, sortOrder }: QueryParams,
  userId: string,
) => {
  return await db
    .select({
      id: notifications.id,
      type: notifications.type,
      payload: notifications.payload,
      read: notifications.read,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(eq(notifications.userId, userId))
    // @ts-expect-error TS complains about sortField being "any"
    .orderBy(getOrder(sortOrder), notifications[sortField])
    .limit(PAGE_SIZE)
    .offset(page * PAGE_SIZE);
};

export const addNotification = async (payload: BaseNotification) => {
  return await db.insert(notifications).values({ ...payload, read: false });
};

export const updateNotification = async (payload: UpdateNotificationPayload) => {
  const result = await db
    .update(notifications)
    .set({ read: payload.read, updatedAt: new Date() })
    .where(eq(notifications.id, payload.id))
    .returning({
      id: notifications.id,
      type: notifications.type,
      payload: notifications.payload,
      read: notifications.read,
      createdAt: notifications.createdAt,
    });

  return result[0];
};

export const deleteNotification = async (notifId: string, userId: string) => {
  await db
    .delete(notifications)
    .where(and(eq(notifications.id, notifId), eq(notifications.userId, userId)));
};

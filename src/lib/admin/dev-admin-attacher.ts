/**
 * DEV ONLY — Attache le header X-Dev-Admin aux server functions.
 * Retirer avec dev-admin.ts en production.
 */
import { createMiddleware } from "@tanstack/react-start";
import { DEV_ADMIN_ENABLED, isDevSuperAdminSession } from "@/lib/dev-admin";

export const attachDevAdmin = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const headers: Record<string, string> = {};
  if (DEV_ADMIN_ENABLED && isDevSuperAdminSession()) {
    headers["X-Dev-Admin"] = "1";
  }
  return next({ headers });
});

import { cookies } from "next/headers";
import {
  CRM_COOKIE,
  checkPassword,
  sessionCookieOptions,
  signSession
} from "@/lib/crm/auth";
import { fail, guard, ok, parseBody } from "@/lib/crm/http";
import { loginSchema } from "@/lib/crm/schemas";

export const runtime = "nodejs";

/** POST /api/crm/auth, log in with the staff password, set the session cookie. */
export const POST = guard(
  async (req) => {
    const { password } = await parseBody(req, loginSchema);
    if (!checkPassword(password)) return fail("Incorrect password", 401);
    const store = await cookies();
    store.set(CRM_COOKIE, signSession(), sessionCookieOptions);
    return ok({ authenticated: true });
  },
  { public: true }
);

/** DELETE /api/crm/auth, log out. */
export const DELETE = guard(
  async () => {
    const store = await cookies();
    store.delete(CRM_COOKIE);
    return ok({ authenticated: false });
  },
  { public: true }
);

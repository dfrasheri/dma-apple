import { guard, ok, parseBody } from "@/lib/crm/http";
import { reconcileSchema } from "@/lib/crm/schemas";
import * as factsService from "@/lib/crm/services/facts";
import { fetchAccountPosts } from "@/lib/crm/connectors/post-sync";

export const runtime = "nodejs";

export const POST = guard(async (req) => {
  const body = await parseBody(req, reconcileSchema);
  const summary = body?.posts
    ? await factsService.reconcile(body.posts, "full")
    : await factsService.reconcile(await fetchAccountPosts(body?.account), "full");
  return ok(summary);
});

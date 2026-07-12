import { guard, ok, parseBody, notFound } from "@/lib/crm/http";
import { factReviewSchema } from "@/lib/crm/schemas";
import * as factsService from "@/lib/crm/services/facts";

export const runtime = "nodejs";

export const POST = guard(async (req, { params }) => {
  const { id } = await params;
  const body = await parseBody(req, factReviewSchema);
  const fact = await factsService.reviewFact(id, body.decision, body.reviewer);
  return fact ? ok(fact) : notFound("Fact");
});

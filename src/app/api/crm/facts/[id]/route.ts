import { guard, ok, parseBody, notFound } from "@/lib/crm/http";
import { factUpdateSchema } from "@/lib/crm/schemas";
import * as factsService from "@/lib/crm/services/facts";

export const runtime = "nodejs";

export const GET = guard(async (_req, { params }) => {
  const { id } = await params;
  const fact = await factsService.getFact(id);
  return fact ? ok(fact) : notFound("Fact");
});

export const PATCH = guard(async (req, { params }) => {
  const { id } = await params;
  const body = await parseBody(req, factUpdateSchema);
  const fact = await factsService.updateFactFields(id, body);
  return fact ? ok(fact) : notFound("Fact");
});

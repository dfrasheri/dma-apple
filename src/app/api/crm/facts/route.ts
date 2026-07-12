import { guard, ok } from "@/lib/crm/http";
import * as factsService from "@/lib/crm/services/facts";
import type { FactStatus, FactType } from "@/lib/crm/types";
import { FACT_STATUSES, FACT_TYPES } from "@/lib/crm/types";

export const runtime = "nodejs";

export const GET = guard(async (req) => {
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const typeParam = searchParams.get("type");
  const cityParam = searchParams.get("city");

  const status =
    statusParam && (FACT_STATUSES as readonly string[]).includes(statusParam)
      ? (statusParam as FactStatus)
      : undefined;
  const type =
    typeParam && (FACT_TYPES as readonly string[]).includes(typeParam)
      ? (typeParam as FactType)
      : undefined;
  const city = cityParam ?? undefined;

  return ok(await factsService.listFacts({ status, type, city }));
});

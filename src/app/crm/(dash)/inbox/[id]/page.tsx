import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ChannelIcon } from "@/components/crm/ChannelIcon";
import {
  Badge,
  Card,
  relativeTime,
  SectionHeading
} from "@/components/crm/ui";
import { CHANNEL_META, CONVERSATION_STATUS_META } from "@/lib/crm/display";
import * as inboxService from "@/lib/crm/services/inbox";
import { cn } from "@/lib/utils";
import { Composer } from "../_components/Composer";

export default async function ConversationPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conv = await inboxService.getConversation(id);
  if (!conv) notFound();

  const lastInboundMs = conv.lastInboundAt ? conv.lastInboundAt.getTime() : null;
  const contactName = conv.contact?.name ?? "Unknown contact";

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/crm/inbox"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to inbox
        </Link>
      </div>

      <SectionHeading
        title={contactName}
        subtitle={
          <span className="inline-flex items-center gap-1.5">
            <ChannelIcon channel={conv.channel} className="h-3.5 w-3.5" />
            {CHANNEL_META[conv.channel].label}
          </span>
        }
        action={
          <Badge className={CONVERSATION_STATUS_META[conv.status].className}>
            {CONVERSATION_STATUS_META[conv.status].label}
          </Badge>
        }
      />

      <Card className="p-5">
        {conv.messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">No messages in this thread yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {conv.messages.map((m) => {
              const isOut = m.direction === "out";
              const requiresTemplate =
                m.meta && (m.meta as Record<string, unknown>).requiresTemplate === true;
              // Engagement signals (followed / liked / came via ad) render as
              // the centered grey context line, like Instagram shows them.
              if (m.author === "system") {
                return (
                  <li key={m.id} className="flex justify-center">
                    <p className="max-w-[85%] text-center text-xs italic text-zinc-500">
                      ⚡ {m.body} · {relativeTime(m.createdAt)}
                    </p>
                  </li>
                );
              }
              return (
                <li
                  key={m.id}
                  className={cn("flex flex-col", isOut ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                      isOut
                        ? "bg-[var(--elx-gold)]/15 text-zinc-900 ring-1 ring-inset ring-[var(--elx-gold)]/25"
                        : "bg-zinc-100 text-zinc-800 ring-1 ring-inset ring-zinc-200"
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  </div>
                  <div
                    className={cn(
                      "mt-1 flex items-center gap-2 px-1 text-xs text-zinc-500",
                      isOut ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <span className="capitalize">{m.author}</span>
                    <span aria-hidden>·</span>
                    <span className="tabular-nums">{relativeTime(m.createdAt)}</span>
                  </div>
                  {requiresTemplate && (
                    <p
                      className={cn(
                        "mt-0.5 px-1 text-[11px] text-amber-700",
                        isOut ? "text-right" : "text-left"
                      )}
                    >
                      outside 24h, template required
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <div className="mt-5">
        <Composer conversationId={conv.id} lastInboundMs={lastInboundMs} />
      </div>
    </div>
  );
}

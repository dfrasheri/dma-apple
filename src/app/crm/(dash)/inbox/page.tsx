import Link from "next/link";
import { Inbox as InboxIcon } from "lucide-react";
import { ChannelIcon } from "@/components/crm/ChannelIcon";
import {
  Badge,
  Card,
  EmptyState,
  relativeTime,
  SectionHeading
} from "@/components/crm/ui";
import { CONVERSATION_STATUS_META } from "@/lib/crm/display";
import * as inboxService from "@/lib/crm/services/inbox";
import { CONVERSATION_STATUSES } from "@/lib/crm/types";
import type { ConversationStatus } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

function truncate(s: string | null | undefined, n = 80): string {
  if (!s) return "";
  return s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
}

export default async function InboxPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const statusParam = sp.status;
  const status =
    statusParam && (CONVERSATION_STATUSES as readonly string[]).includes(statusParam)
      ? (statusParam as ConversationStatus)
      : undefined;

  const conversations = await inboxService.listConversations({ status });

  const filters: { label: string; value?: ConversationStatus }[] = [
    { label: "All", value: undefined }, ...CONVERSATION_STATUSES.map((s) => ({ label: CONVERSATION_STATUS_META[s].label, value: s }))
  ];

  return (
    <div>
      <SectionHeading
        title="Inbox"
        subtitle="Unified omnichannel conversations, Instagram, WhatsApp, Messenger, web chat & email"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = status === f.value;
          const href = f.value ? `/crm/inbox?status=${f.value}` : "/crm/inbox";
          return (
            <Link
              key={f.label}
              href={href}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-[var(--elx-gold)]/50 bg-[var(--elx-gold)]/10 text-[var(--elx-gold)]"
                  : "border-zinc-200 text-zinc-700 hover:bg-zinc-100"
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <Card>
        {conversations.length === 0 ? (
          <EmptyState
            icon={<InboxIcon className="h-8 w-8" />}
            title="No conversations"
            hint="Inbound messages from any channel will appear here as they arrive."
          />
        ) : (
          <ul className="divide-y divide-zinc-200">
            {conversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/crm/inbox/${c.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                >
                  <span className="shrink-0 text-zinc-600">
                    <ChannelIcon channel={c.channel} className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {c.unread && (
                        <span
                          aria-label="Unread"
                          className="h-2 w-2 shrink-0 rounded-full bg-[var(--elx-gold)]"
                        />
                      )}
                      <span className="truncate font-medium text-zinc-900">
                        {c.contact?.name ?? "Unknown contact"}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-zinc-600">
                      {truncate(c.lastMessage?.body) || "No messages yet"}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <Badge className={CONVERSATION_STATUS_META[c.status].className}>
                      {CONVERSATION_STATUS_META[c.status].label}
                    </Badge>
                    <span className="text-xs tabular-nums text-zinc-500">
                      {relativeTime(c.lastMessageAt)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

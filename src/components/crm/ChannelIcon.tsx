// NB: lucide-react v1 removed brand icons (Instagram/Facebook/…), so the
// Instagram channel uses the generic camera glyph.
import { Camera, Globe, Mail, MessageCircle, Send, type LucideProps } from "lucide-react";
import type { Channel } from "@/lib/crm/types";

const MAP: Record<Channel, React.ComponentType<LucideProps>> = {
  instagram: Camera,
  whatsapp: MessageCircle,
  messenger: Send,
  webchat: Globe,
  email: Mail
};

export function ChannelIcon({ channel, ...props }: { channel: Channel } & LucideProps) {
  const Icon = MAP[channel] ?? Globe;
  return <Icon {...props} />;
}

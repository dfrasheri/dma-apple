import { NavBar } from "@/components/NavBar";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCta } from "@/components/StickyCta";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbf7f2]">
      <NavBar />
      <main>{children}</main>
      <SiteFooter />
      <StickyCta />
    </div>
  );
}

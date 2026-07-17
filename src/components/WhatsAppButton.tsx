import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

export default function WhatsAppButton({ number, name }: { number: string; name?: string }) {
  return (
    <a
      href={whatsappLink(number, name ? `Hi, I found ${name} on N-ME App.` : undefined)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full bg-wa px-4 py-2 text-xs font-semibold text-white hover:brightness-95"
    >
      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
    </a>
  );
}

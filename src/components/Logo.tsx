import Image from "next/image";
import Link from "next/link";

/** Official N-ME logo (public/logo.png, transparent background). */
export default function Logo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <Link href="/" aria-label="N-ME App home" className="shrink-0">
      <Image
        src="/logo.png"
        alt="N-ME — Keep in touch for your needs"
        width={117}
        height={114}
        priority
        className={`${className} object-contain`}
      />
    </Link>
  );
}

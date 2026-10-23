import { formatPhone, toTelHref, type PhoneParts } from "@/lib/phone/formatPhone";

type PhoneNumberLinkProps = PhoneParts & {
  className?: string;
};

export default function PhoneNumberLink({
  dialCode,
  national,
  className,
}: PhoneNumberLinkProps) {
  const href = toTelHref({ dialCode, national });
  const label = formatPhone({ dialCode, national });

  if (!href) {
    return <span className={className}>{label}</span>;
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}
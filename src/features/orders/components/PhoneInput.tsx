"use client";

import PhoneInputLib, { type CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { splitNationalFromE164 } from "@/lib/phone/formatPhone";

type PhoneInputProps = {
  id?: string;
  countryCode: string;
  phoneNumber: string;
  required?: boolean;
  onChangeAction: (value: { phoneCountryCode: string; phoneNumber: string }) => void;
};

export default function PhoneInput({
  id,
  countryCode,
  phoneNumber,
  required,
  onChangeAction,
}: PhoneInputProps) {
  const handleChange = (value: string, data: CountryData) => {
    const country = data as CountryData;
    const dialCode = (country?.dialCode ?? "").replace(/\D/g, "");

    onChangeAction({
      phoneCountryCode: dialCode ? `+${dialCode}` : countryCode,
      phoneNumber: splitNationalFromE164(value, dialCode),
    });
  };

  const fullValue =
    countryCode.replace(/\D/g, "") + phoneNumber.replace(/\D/g, "");

  return (
    <PhoneInputLib
      country="ie"
      preferredCountries={["ie", "gb"]}
      enableSearch
      searchPlaceholder="Search country or code"
      countryCodeEditable={false}
      value={fullValue}
      onChange={handleChange}
      inputProps={{
        id,
        required,
        type: "tel",
        "aria-label": "Phone number",
      }}
      containerClass="enquire-phone"
      inputClass="enquire-phone__input"
      buttonClass="enquire-phone__button"
      dropdownClass="enquire-phone__dropdown"
      searchClass="enquire-phone__search"
    />
  );
}
"use client";

import React, {useState} from "react";
import { useCart } from "@/app/contexts/CartContext";

interface EnquiryFormState {
  firstName: string;
  lastName: string;
  county: string;
  country: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  organisation: string; // club / school / institution
  quantity: string;
  message: string;
}

const COUNTIES = [
  "Antrim",
  "Armagh",
  "Carlow",
  "Cavan",
  "Clare",
  "Cork",
  "Derry",
  "Donegal",
  "Down",
  "Dublin",
  "Fermanagh",
  "Galway",
  "Kerry",
  "Kildare",
  "Kilkenny",
  "Laois",
  "Leitrim",
  "Limerick",
  "Longford",
  "Louth",
  "Mayo",
  "Meath",
  "Monaghan",
  "Offaly",
  "Roscommon",
  "Sligo",
  "Tipperary",
  "Tyrone",
  "Waterford",
  "Westmeath",
  "Wexford",
  "Wicklow",
  "Rest of the world",
];

export default function EnquirePage() {
  const { items, totalQuantity } = useCart();

  const [form, setForm] = useState<EnquiryFormState>({
    firstName: "",
    lastName: "",
    county: "",
    country: "",
    email: "",
    phoneCountryCode: "+353",
    phoneNumber: "",
    organisation: "",
    quantity: totalQuantity > 0 ? String(totalQuantity) : "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form,
          items: items.map((item) => ({
            quantity: item.quantity,
            productConfig: item.config,
          })),
        }),
      });

      if (!response.ok) {
          console.error("API error:", response.status, response.statusText);
          alert("Failed to submit enquiry. Please try again.");
          return;
      }

      const data = await response.json();
      alert("Enquiry submitted successfully!");
      console.log("Response:", data);
    } catch (error) {
      console.error("Enquiry submission failed:", error);
      alert("Failed to submit enquiry. Please try again.");
    }
  };

  const inputClass =
    "mt-1 block w-full rounded-md border text-black border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  const labelClass = "block text-sm font-medium text-black";

  return (

    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl text-black font-bold tracking-tight text-center">
          Please complete the form for a successful enquiry
        </h1>

        <div className="mt-8 grid place-items-center">
          <section className="w-full">

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First name + Last name */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={labelClass}>
                    First name<span className="text-red-500"> *</span>

                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>
                    Last name<span className="text-red-500"> *</span>

                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* County + Country */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <label htmlFor="county" className={labelClass}>
                    County<span className="text-red-500"> *</span>

                  </label>
                  <select
                    id="county"
                    name="county"
                    required
                    value={form.county}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Please select from list...
                    </option>
                    {COUNTIES.map((county) => (
                      <option key={county} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="country" className={labelClass}>
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Optional"
                    value={form.country}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Country code + Phone number */}
              <div className="grid gap-4 md:grid-cols-[0.6fr_1.4fr]">
                <div>
                  <label htmlFor="phoneCountryCode" className={labelClass}>
                    Country code<span className="text-red-500"> *</span>

                  </label>
                  <select
                    id="phoneCountryCode"
                    name="phoneCountryCode"
                    required
                    value={form.phoneCountryCode}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="+353">🇮🇪 +353</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+421">🇸🇰 +421</option>
                    <option value="+420">🇨🇿 +420</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="phoneNumber" className={labelClass}>
                    Phone number<span className="text-red-500"> *</span>

                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email address */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address<span className="text-red-500"> *</span>

                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Organisation (optional) */}
              <div>
                <label htmlFor="organisation" className={labelClass}>
                  Your club, School or Institution name
                </label>
                <input
                  id="organisation"
                  name="organisation"
                  type="text"
                  value={form.organisation}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Quantity required */}
              <div>
                <label htmlFor="quantity" className={labelClass}>
                  Estimate quantity required<span className="text-red-500"> *</span>

                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="Minimum 12 quantity or €250 worth of order value"
                  min={12}
                  required
                  value={form.quantity}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Additional information (optional) */}
              <div>
                <label htmlFor="message" className={labelClass}>
                  Additional information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Any extra information about sizes, colours, specific requirements, etc."
                />
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md cursor-pointer bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

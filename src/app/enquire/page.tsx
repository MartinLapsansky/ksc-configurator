"use client";

import React, {useState} from "react";
import { useJerseyConfig } from "@/app/contexts/JerseyConfigContext";

interface EnquiryFormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  organisation: string; // club / school / company
  quantity: string;
  leadTime: string;
  message: string;
}

export default function EnquirePage() {
  const { config } = useJerseyConfig();

  const [form, setForm] = useState<EnquiryFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "+421",
    phoneNumber: "",
    organisation: "",
    quantity: "",
    leadTime: "",
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
          jerseyConfig: config,
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

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl text-black font-semibold tracking-tight">
          Enquire about this jersey
        </h1>

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Formulár */}
          <section>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-black"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border text-black border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border text-black border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.6fr_1.4fr]">
                <div>
                  <label
                    htmlFor="phoneCountryCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country code
                  </label>
                  <select
                    id="phoneCountryCode"
                    name="phoneCountryCode"
                    value={form.phoneCountryCode}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="+421">🇸🇰 +421</option>
                    <option value="+420">🇨🇿 +420</option>
                    <option value="+353">🇮🇪 +353</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+1">🇺🇸 +1</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border text-black border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border text-black border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="organisation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your club, school or company
                </label>
                <input
                  id="organisation"
                  name="organisation"
                  type="text"
                  value={form.organisation}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border text-black border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity required
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border text-black border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="leadTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Lead time (when would you like delivery?)
                  </label>
                  <input
                    id="leadTime"
                    name="leadTime"
                    type="text"
                    placeholder="e.g. By end of June"
                    value={form.leadTime}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border text-black border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border text-black border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Any extra info about sizes, colours, deadlines, etc."
                />
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md cursor-pointer bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Submit enquiry
                </button>
              </div>
            </form>
          </section>

          {/* Sumár konfigurácie dresu */}
          <aside className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm">
            <h2 className="text-base font-semibold text-black">
              Jersey configuration summary
            </h2>
            {config ? (
                    <div className="mt-3 space-y-3">
                <div>
                  <h3 className="font-medium text-black">Colours</h3>
                  <ul className="mt-1 space-y-1">
                    <li>
                      <span className="text-gray-500">Main body: </span>
                      <span className="text-black">{config.bgColor.name}</span>{" "}
                      <span className="text-xs text-gray-400">
                        ({config.bgColor.hex})
                      </span>
                    </li>
                    <li>
                      <span className="text-gray-500">Stripes: </span>
                      <span className="text-black">{config.stripeColor.name}</span>{" "}
                      <span className="text-xs text-gray-400">
                        ({config.stripeColor.hex})
                      </span>
                    </li>
                    <li>
                      <span className="text-gray-500">Branding: </span>
                      <span className="text-black">{config.brandingColor.name}</span>{" "}
                      <span className="text-xs text-gray-400">
                        ({config.brandingColor.hex})
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700">Logos</h3>
                  <ul className="mt-1 space-y-1">
                    <li>
                      <span className="text-gray-500">Left chest logo: </span>
                      <span className="text-black">
                        {config.leftChestLogoUrl ? "Custom upload" : "Not set"}
                      </span>
                    </li>
                    <li>
                      <span className="text-gray-500">Right chest logo: </span>
                      <span className="text-black">{config.rightLogo?.name ?? "Not set"}</span>
                    </li>
                    <li>
                      <span className="text-gray-500">Front sponsor logo: </span>
                      <span className="text-black">
                        {config.sponsorLogoUrl ? "Custom upload" : "Not set"}
                      </span>
                    </li>
                    <li>
                      <span className="text-gray-500">Back sponsor logo: </span>
                      <span className="text-black">
                        {config.backLogoUrl ? "Custom upload" : "Not set"}
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700">Text</h3>
                  <ul className="mt-1 space-y-1">
                    <li>
                      <span className="text-gray-500">Front sponsor text: </span>
                      {config.frontTextConfig.enabled &&
                      config.frontTextConfig.text ? (
                        <span className="text-black">
                          {config.frontTextConfig.text}{" "}
                          <span className="text-xs text-black">
                            ({config.frontTextConfig.color.name})
                          </span>
                        </span>
                      ) : (
                        <span className="text-black">Not set</span>
                      )}
                    </li>
                    <li>
                      <span className="text-gray-500">Back sponsor text: </span>
                      {config.backTextConfig.enabled &&
                      config.backTextConfig.text ? (
                        <span className="text-black">
                          {config.backTextConfig.text}{" "}
                          <span className="text-xs text-gray-400">
                            ({config.backTextConfig.color.name})
                          </span>
                        </span>
                      ) : (
                        <span className="text-black">Not set</span>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                Konfigurácia dresu nebola načítaná. Prosím, vráť sa na hlavnú
                stránku, nakonfiguruj dres a klikni na{" "}
                <span className="font-medium">“Enquire about this jersey”</span>.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
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
        <h1 className="text-2xl text-black font-semibold tracking-tight text-center">
          Enquire about this jersey
        </h1>

        <div className="mt-8 grid place-items-center">
          {/* Formulár */}
          <section>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md">
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
        </div>
      </div>
    </main>
  );
}
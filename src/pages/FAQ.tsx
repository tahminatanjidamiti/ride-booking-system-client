import { useState } from "react";
import { Input } from "@/components/ui/input";

const faqs = [
  { q: "How do I book a ride?", a: "Simply go to the rider desire dashboard, with location using map and choose a driver request for ride and book ride in a minute." },
  { q: "How are drivers verified?", a: "All drivers go through ID verification and background checks." },
  { q: "Can a rider be a driver?", a: "Yes, go to the request driver page and fill out the vehicle information, location, and default driver role make a request for a driver with the rider role - name, email, and phone fields, where read-only and by admin approval, can rider role will be changed by the role driver." },
  { q: "Can I cancel a ride?", a: "Yes, rides can be cancelled before ride status completed." },
  { q: "How do payments work?", a: "All our transactions are powered by SSLCommerz, providing you with safe and seamless payment through cards, mobile wallets, and cash." },
];

export default function FAQ() {
  const [query, setQuery] = useState("");

  const filtered = faqs.filter((faq) =>
    faq.q.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
      <Input
        placeholder="Search a question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((faq) => (
            <details key={faq.q} className="p-4 border rounded-lg shadow-sm">
              <summary className="cursor-pointer font-semibold">{faq.q}</summary>
              <p className="mt-2 text-gray-600">{faq.a}</p>
            </details>
          ))
        ) : (
          <p className="text-gray-500">No questions found.</p>
        )}
      </div>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/faq")({
  component: FAQPage,
  head: () => ({
    meta: [{ title: "FAQ | Snepr" }],
  }),
});

const faqs = [
  {
    question: "What is Snepr?",
    answer:
      "Snepr is a live waitlist and queue management application for salons. It allows customers to see live wait times, join a queue from their phone, and walk straight into the salon when it's their turn.",
  },
  {
    question: "Do I need to download an app?",
    answer:
      "No! Snepr works directly in your web browser. You can access all features without downloading anything, though we recommend adding it to your home screen for easy access.",
  },
  {
    question: "Is Snepr free for customers?",
    answer:
      "Yes, Snepr is completely free for customers to use. You'll never be charged for checking wait times or joining a queue.",
  },
  {
    question: "How do I know when it's my turn?",
    answer:
      "When you join a queue, you'll see your live position. You can track your estimated wait time in real-time. We'll also notify you when you're next in line so you can head to the salon.",
  },
  {
    question: "I'm a salon owner. How do I get Snepr?",
    answer:
      "We'd love to have you! You can head over to our Contact page to book a quick 15-minute demo, or click the 'Get Snepr for your salon' button on our homepage to express your interest.",
  },
  {
    question: "What happens if I'm late for my turn?",
    answer:
      "Salons typically have a grace period (usually 5-10 minutes). If you miss your grace period, you may be moved down the queue or removed, depending on the individual salon's policy.",
  }
];

function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16 w-full">
      <div className="mb-12 text-center">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8c4d27] bg-[#f2e6dc] px-3 py-1 rounded-full">
          Got questions?
        </span>
        <h1 className="mt-3 mb-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#211914] font-serif">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-[#81736a] max-w-xl mx-auto">
          Everything you need to know about Snepr, live chair queues, and 0% commission operations in Bhubaneswar.
        </p>
      </div>

      <div className="rounded-3xl border border-[#e9dfd5] bg-[#fffdfa] p-6 shadow-xs sm:p-10 divide-y divide-[#e9dfd5]">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-[#e9dfd5] py-2">
              <AccordionTrigger className="text-left text-base sm:text-lg font-bold text-[#211914] hover:text-[#8c4d27] transition-colors py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#81736a] leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="mt-14 text-center space-y-3">
        <p className="text-base text-[#81736a]">Still have questions or need partner assistance?</p>
        <Link
          to="/contact"
          className="inline-block px-7 py-3.5 rounded-xl bg-[#8c4d27] hover:bg-[#6e3717] text-white text-xs font-bold transition-colors shadow-sm"
        >
          Contact Support Desk →
        </Link>
      </div>
    </div>
  );
}

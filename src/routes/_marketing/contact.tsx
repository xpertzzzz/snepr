import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/_marketing/contact")({
  component: ContactPage,
  head: () => ({
    meta: [{ title: "Contact Us | Snepr" }],
  }),
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Sending message...",
        success: "Message sent! We'll get back to you shortly.",
        error: "Failed to send message.",
      }
    );
    form.reset();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16 w-full">
      <div className="mb-12 max-w-2xl">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8c4d27] bg-[#f2e6dc] px-3 py-1 rounded-full">
          Get in touch
        </span>
        <h1 className="mt-3 mb-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#211914] font-serif">
          We'd love to hear from you.
        </h1>
        <p className="text-base text-[#81736a]">
          Have questions about Snepr? Whether you're a salon owner looking to partner with us or a customer with questions, our Bhubaneswar team is here for you.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Contact Form */}
        <div className="rounded-3xl border border-[#e9dfd5] bg-[#fffdfa] p-6 shadow-xs sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-[#211914]">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" className="bg-[#f7f3ed] border-[#e9dfd5] text-[#211914] focus-visible:ring-[#8c4d27]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-[#211914]">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" type="email" className="bg-[#f7f3ed] border-[#e9dfd5] text-[#211914] focus-visible:ring-[#8c4d27]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-[#211914]">Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="How can we help?" className="bg-[#f7f3ed] border-[#e9dfd5] text-[#211914] focus-visible:ring-[#8c4d27]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-[#211914]">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more about your inquiry..."
                        className="min-h-[120px] resize-y bg-[#f7f3ed] border-[#e9dfd5] text-[#211914] focus-visible:ring-[#8c4d27]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full sm:w-auto bg-[#8c4d27] hover:bg-[#6e3717] text-white font-bold px-8 py-3 rounded-xl cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-[#e9dfd5] bg-[#fffdfa] p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold font-serif text-[#211914]">Contact Details</h3>
            <div className="space-y-5 text-sm text-[#81736a]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f7f3ed] border border-[#e9dfd5] flex items-center justify-center text-[#8c4d27] shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-[#211914]">Email Us</p>
                  <a href="mailto:support@snepr.in" className="hover:text-[#8c4d27] transition-colors">support@snepr.in</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f7f3ed] border border-[#e9dfd5] flex items-center justify-center text-[#8c4d27] shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-[#211914]">Customer & Partner Support</p>
                  <p className="text-xs">Mon–Sat from 9am to 8pm</p>
                  <a href="tel:+919237362221" className="hover:text-[#8c4d27] transition-colors">+91 92373 62221</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f7f3ed] border border-[#e9dfd5] flex items-center justify-center text-[#8c4d27] shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-[#211914]">City Operations</p>
                  <p>Patia & KIIT Road Hub<br />Bhubaneswar, Odisha – 751024</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl border border-[#e9dfd5] bg-[#f2e6dc]/60 p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-bold font-serif text-[#211914]">For Salon Owners</h3>
            <p className="text-xs text-[#81736a] leading-relaxed">
              Want to eliminate waiting rooms and take control of your chairs? Onboarding takes less than 5 minutes.
            </p>
            <a
              href="/partner/register"
              className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-[#211914] text-white text-xs font-bold hover:bg-[#8c4d27] transition-colors"
            >
              Register Your Salon →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

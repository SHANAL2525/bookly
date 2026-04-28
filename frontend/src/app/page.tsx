import Image from "next/image";
import Navbar from "@/components/layout/Navbar";

export default function LandingPage() {
  const features = ["Easy Scheduling", "Manage Staff", "Analytics Dashboard"];

  const testimonials = [
    {
      name: "sarah kim",
      role: "salon owner",
      quote: "Bookly made our booking process faster and easier for both staff and clients."
    },
    {
      name: "michael torres",
      role: "clinic manager",
      quote: "The setup was simple, and our daily schedule is now much more organized."
    },
    {
      name: "nadia perera",
      role: "spa founder",
      quote: "We reduced no-shows and finally have one clean place to manage appointments."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ff]">
      <Navbar />

      <section className="animate-fade-in-up w-full bg-gradient-to-r from-[#6D5DF6] to-[#C7B8FF]">
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-8 md:pb-9 md:pt-9">
          <div className="grid items-center gap-7 md:grid-cols-2 md:gap-8">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold leading-tight text-white md:text-[52px] md:leading-[1.08]">
                Booking Made Simple
                <br />
                <span className="font-semibold">for Your Business</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#f3efff] md:text-base">
                Streamline your appointment scheduling and manage your services with ease. Perfect for salons, clients,
                tutors, and repair services.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-lg bg-[#5f50ef] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5243e6]"
                  href="/register"
                >
                  Get Started
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#4338ca] transition hover:bg-[#f8f7ff]"
                  href="/customer-booking"
                >
                  View demo
                </a>
              </div>
            </div>

            <div className="md:justify-self-end">
              <Image
                src="/landing-preview.png"
                alt="Bookly dashboard preview"
                width={640}
                height={430}
                priority
                className="h-auto w-full max-w-[620px] rounded-2xl shadow-[0_14px_38px_rgba(46,29,145,0.22)]"
              />
            </div>
          </div>

          <section id="features" className="mt-7 grid gap-3 md:mt-8 md:grid-cols-3">
            {features.map((title) => (
              <div key={title} className="card-hover-lift animate-fade-in-up rounded-xl bg-white px-4 py-3 shadow-[0_8px_18px_rgba(46,29,145,0.12)]">
                <p className="text-sm font-semibold text-[#1f2937]">{title}</p>
              </div>
            ))}
          </section>
        </div>
      </section>

      <section id="pricing" className="h-0 w-0 overflow-hidden" aria-hidden="true" />

      <section id="contact" className="bg-[#eee9ff]">
        <div className="mx-auto max-w-7xl px-6 pb-9 pt-7 md:pb-10 md:pt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1f2937] md:text-3xl">What our Customers Are Saying</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="card-hover-lift animate-fade-in-up rounded-xl bg-white p-4 shadow-[0_8px_18px_rgba(80,63,180,0.1)]">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#d1d5db]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1f2937]">{item.name}</p>
                    <p className="text-xs text-[#6b7280]">{item.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#4b5563]">{item.quote}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

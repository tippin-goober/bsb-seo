import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-12">
      {/* Page Header */}
      <section className="text-center">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600">
          Get in touch for a free estimate or any questions about our services.
        </p>
      </section>

      {/* Contact Info */}
      <section className="text-center space-y-2">
        <p>
          📞{" "}
          <a href="tel:3212836902" className="text-blue-600 hover:underline">
            (321) 283-6902
          </a>
        </p>
        <p>
          📧{" "}
          <a
            href="mailto:info@bsbtractorservices.com"
            className="text-blue-600 hover:underline"
          >
            info@bsbtractorservices.com
          </a>
        </p>
        <p>📍 De Leon Springs, FL</p>
      </section>

      {/* Contact Form */}
      <section>
        <form className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block font-medium">Message</label>
            <textarea
              required
              className="w-full border px-3 py-2 rounded"
              rows={4}
              placeholder="Tell us about your project..."
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Send Message
          </button>
        </form>
      </section>

      {/* Back Link */}
      <section className="text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}

import Link from "next/link";
import client from "@/lib/hygraph";
import { gql } from "graphql-request";

const HOMEPAGE_QUERY = gql`
  query HomepageData {
    services {
      id
      name
      slug
      shortDesc
    }
    citylocations {
      id
      city
      slug
    }
  }
`;

export default async function HomePage() {
  const { services, citylocations } = await client.request<{
    services: { id: string; name: string; slug: string; shortDesc: string }[];
    citylocations: { id: string; city: string; slug: string }[];
  }>(HOMEPAGE_QUERY);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">BSB Tractor Services</h1>
        <p className="text-lg text-gray-600 mb-6">
          Land clearing, stump grinding, junk removal and more — trusted services across Volusia County.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Get a Free Estimate
        </Link>
      </section>

      {/* Services Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.shortDesc}</p>
              <Link
                href={`/services/${service.slug}`}
                className="text-blue-600 hover:underline"
              >
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Locations Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Service Areas</h2>
        <ul className="flex flex-wrap justify-center gap-4">
          {citylocations.map((loc) => (
            <li key={loc.id}>
              <Link
                href={`/locations/${loc.slug}`}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                {loc.city}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 p-8 rounded text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
        <p className="mb-4">
          Contact BSB Tractor Services today for a free quote. We’re here to help with your next project.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Contact Us
        </Link>
      </section>
    </main>
  );
}

import client from "@/lib/hygraph";
import { gql } from "graphql-request";
import Link from "next/link";

const ALL_SERVICES = gql`
  {
    services {
      id
      name
      slug
      shortDesc
    }
  }
`;

export default async function ServicesPage() {
  console.log("Rendering ServicesPage");
  
  try {
    console.log("Fetching services data from Hygraph...");
    const { services } = await client.request<{ services: { id: string; name: string; slug: string; shortDesc: string }[] }>(
      ALL_SERVICES
    );
    
    console.log("Services data loaded:", { servicesCount: services?.length });

    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center py-16 mb-16">
          <h1 className="text-5xl font-bold text-heading mb-6 text-gray-900">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional land clearing, stump grinding, junk removal, and more across Volusia County. 
            Quality service you can trust.
          </p>
        </section>

        {/* Services Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-brand/20 hover:-translate-y-1"
              >
                <h2 className="text-2xl font-bold text-heading mb-4 text-gray-900">
                  {service.name}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.shortDesc}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-block bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors duration-200 font-semibold"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-brand to-brand-dark p-12 rounded-2xl text-center text-white shadow-2xl mt-20">
          <h2 className="text-4xl font-bold text-heading mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-brand-light max-w-2xl mx-auto leading-relaxed">
            Contact BSB Tractor Services today for a free quote on any of our services.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-brand px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200 font-bold text-lg"
          >
            Get Free Estimate
          </Link>
        </section>
      </main>
    );
  } catch (err) {
    console.error("Services GraphQL fetch failed:", err);
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-red-600">Error loading services. Please try again later.</p>
        </div>
      </main>
    );
  }
}

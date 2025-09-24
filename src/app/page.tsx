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
  console.log("Rendering Homepage");
  
  try {
    console.log("Fetching homepage data from Hygraph...");
    const { services, citylocations } = await client.request<{
      services: { id: string; name: string; slug: string; shortDesc: string }[];
      citylocations: { id: string; city: string; slug: string }[];
    }>(HOMEPAGE_QUERY);
    
    console.log("Homepage data loaded:", { servicesCount: services?.length, citiesCount: citylocations?.length });

    // Check if we got valid data
    if (!services || !citylocations) {
      console.log("Missing data from Hygraph:", { services: !!services, citylocations: !!citylocations });
      throw new Error("Incomplete data received from Hygraph");
    }

    return (
    <main className="space-y-0">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-gray-900 to-black text-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            BSB Tractor Services
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Land clearing, stump grinding, junk removal and more — trusted
            services across Volusia County.
          </p>
          <Link
            href="/contact"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6 text-center">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Professional land management and property services across Volusia County
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-xl transition"
                >
                  <div className="flex items-start mb-4">
                    <svg className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <h3 className="text-xl font-heading font-semibold text-gray-900">
                      {service.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.shortDesc}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-red-600 hover:text-red-700 font-medium hover:underline transition-colors duration-200"
                  >
                    Learn More →
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No services available at this time.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6 text-center">
            Service Areas
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            We proudly serve communities throughout Volusia County
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {citylocations.length > 0 ? (
              citylocations.map((loc) => (
                <Link
                  key={loc.id}
                  href={`/locations/${loc.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-xl transition text-center group"
                >
                  <div className="flex justify-start mb-3">
                    <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                    {loc.city}
                  </span>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No service areas available at this time.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-600 via-gray-900 to-black text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Contact BSB Tractor Services today for a free quote. We&apos;re here to
            help with your next project.
          </p>
          <Link
            href="/contact"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
    );
  } catch (err) {
    console.error("Homepage GraphQL fetch failed:", err);
    return (
      <main className="space-y-0">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 via-gray-900 to-black text-white py-24 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              BSB Tractor Services
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              Land clearing, stump grinding, junk removal and more — trusted
              services across Volusia County.
            </p>
            <Link
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
            >
              Get a Free Estimate
            </Link>
          </div>
        </section>

        {/* Services Placeholder */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6 text-center">
              Our Services
            </h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 text-center">
              <h3 className="text-xl font-heading font-semibold text-orange-800 mb-2">
                Services Temporarily Unavailable
              </h3>
              <p className="text-orange-600">
                We&apos;re experiencing a temporary issue loading our services. Please contact us directly for assistance.
              </p>
            </div>
          </div>
        </section>

        {/* Locations Placeholder */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6 text-center">
              Service Areas
            </h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 text-center">
              <h3 className="text-xl font-heading font-semibold text-orange-800 mb-2">
                Service Areas Temporarily Unavailable
              </h3>
              <p className="text-orange-600">
                We&apos;re experiencing a temporary issue loading our service areas. Please contact us to discuss your location.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-red-600 via-gray-900 to-black text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              Contact BSB Tractor Services today for a free quote. We&apos;re here to
              help with your next project.
            </p>
            <Link
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
    );
  }
}

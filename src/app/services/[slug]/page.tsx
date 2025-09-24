import Link from "next/link";
import client from "@/lib/hygraph";
import { gql } from "graphql-request";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface FAQ {
    question: string;
    answer: string;
  }
  
  interface Service {
    id: string;
    name: string;
    slug: string;
    shortDesc: string;
    faqs: FAQ[];
  }
  

interface ServiceLocation {
  id: string;
  cityLocation: {
    city: string;
    slug: string;
  } | null;
}

const ALL_SERVICES = gql`
  query AllServices {
    services {
      id
      name
      slug
      shortDesc
      faqs {
        ... on Faq {
          question
          answer
        }
      }
    }
  }
`;

const LOCATIONS_BY_SERVICE = gql`
  query LocationsByService($id: ID!) {
    serviceLocations(where: { service: { id: $id } }) {
      id
      cityLocation {
        id
        city
        slug
      }
    }
  }
`;

interface Props {
  params: Promise<{ slug: string }>;
}

// ✅ Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { services } = await client.request<{ services: Service[] }>(
      ALL_SERVICES
    );

    const service = services.find((s) => s.slug === slug);
    if (!service) return {};

    const { serviceLocations } = await client.request<{
      serviceLocations: ServiceLocation[];
    }>(LOCATIONS_BY_SERVICE, { id: service.id });

    const cities = serviceLocations
      .map((sl) => sl.cityLocation?.city)
      .filter(Boolean);

    const cityPart = cities.length > 0 ? ` in ${cities.join(", ")}` : "";

    return {
      title: `${service.name}${cityPart} | BSB Tractor Services`,
      description: service.shortDesc,
    };
  } catch {
    return {};
  }
}

export default async function ServicePage({ params }: Props) {
  console.log("Rendering ServicePage");
  
  try {
    const { slug } = await params;
    console.log("Fetching service data for slug:", slug);
    
    const { services } = await client.request<{ services: Service[] }>(
      ALL_SERVICES
    );
    console.log("All services loaded:", services.length);

    const service = services.find((s) => s.slug === slug);
    if (!service) {
      console.log("Service not found for slug:", slug);
      return (
        <main className="space-y-0">
          <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
                <h1 className="text-3xl font-heading font-bold text-orange-800 mb-4">Service Not Found</h1>
                <p className="text-orange-600 mb-6">
                  We couldn&apos;t find a service matching &quot;{slug}&quot;. This service may not be available.
                </p>
                <Link
                  href="/services"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </section>
        </main>
      );
    }
    
    console.log("Found service:", service.name, "with ID:", service.id);
    console.log("Service data:", JSON.stringify(service, null, 2));

    const { serviceLocations } = await client.request<{
      serviceLocations: ServiceLocation[];
    }>(LOCATIONS_BY_SERVICE, { id: service.id });
    
    console.log("Service locations loaded:", serviceLocations.length);
    console.log("Service locations data:", JSON.stringify(serviceLocations, null, 2));

    // Filter out any service locations with null cityLocation
    const validLocations = serviceLocations.filter(sl => sl.cityLocation !== null);
    console.log("Valid locations after filtering:", validLocations.length);

    return (
      <main className="space-y-0">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 via-gray-900 to-black text-white py-24 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              {service.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              {service.shortDesc}
            </p>
          </div>
        </section>

        {/* Service Locations */}
        {validLocations.length > 0 ? (
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6 text-center">
                Available in These Areas
              </h2>
              <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
                We provide {service.name.toLowerCase()} services in these locations
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {validLocations.map((sl) => (
                  <Link
                    key={sl.id}
                    href={`/locations/${sl.cityLocation!.slug}`}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-xl transition text-center group"
                  >
                    <div className="flex justify-start mb-3">
                      <svg
                        className="h-5 w-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                      {sl.cityLocation!.city}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
                <h2 className="text-xl font-heading font-semibold text-blue-800 mb-2">
                  Service Area Expanding
                </h2>
                <p className="text-blue-600">
                  We&apos;re working to bring this service to more areas. Contact us to see if we can help with your project.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        {service.faqs?.length > 0 && (
          <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
                Common questions about our {service.name.toLowerCase()} services
              </p>
              <div className="space-y-6">
                {service.faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-xl transition">
                    <div className="flex items-start mb-4">
                      <svg className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-xl font-heading font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed ml-9">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-red-600 via-gray-900 to-black text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready for {service.name}?
            </h2>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              Contact BSB Tractor Services today for a free quote on {service.name.toLowerCase()}.
            </p>
            <Link
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
            >
              Get Free Estimate
            </Link>
          </div>
        </section>
      </main>
    );
  } catch (err) {
    console.error("Error fetching service by slug:", err);
    return (
      <main className="space-y-0">
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <h1 className="text-3xl font-heading font-bold text-red-800 mb-4">Service Unavailable</h1>
              <p className="text-red-600 mb-6">
                We&apos;re experiencing a temporary issue loading this service. Please try again or contact us for assistance.
              </p>
              <Link
                href="/services"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

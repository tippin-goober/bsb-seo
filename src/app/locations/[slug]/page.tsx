import Link from "next/link";
import client from "@/lib/hygraph";
import { gql } from "graphql-request";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const LOCATION_BY_SLUG = gql`
  query LocationBySlug($slug: String!) {
    citylocation(where: { slug: $slug }) {
      id
      city
      slug
    }
  }
`;

const SERVICES_BY_CITY = gql`
  query ServicesByCity($cityId: ID!) {
    serviceLocations(where: { cityLocation: { id: $cityId } }) {
      id
      service {
        id
        name
        slug
        shortDesc
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
    const { citylocation } = await client.request<{
      citylocation: {
        id: string;
        city: string;
        slug: string;
      } | null;
    }>(LOCATION_BY_SLUG, { slug });

    if (!citylocation) return {};

    return {
      title: `Service Areas: ${citylocation.city} | BSB Tractor Services`,
      description: `BSB Tractor Services in ${citylocation.city}: land clearing, stump grinding, junk removal, and more.`,
    };
  } catch {
    return {};
  }
}

export default async function LocationPage({ params }: Props) {
  console.log("Rendering LocationPage");
  
  try {
    const { slug } = await params;
    console.log("Fetching location data for slug:", slug);
    
    const { citylocation } = await client.request<{
      citylocation: {
        id: string;
        city: string;
        slug: string;
      } | null;
    }>(LOCATION_BY_SLUG, { slug });

    console.log("City location loaded:", citylocation ? "Found" : "Not found");
    console.log("City location data:", JSON.stringify(citylocation, null, 2));

    // Handle case where citylocation is null
    if (!citylocation) {
      console.log("No city location found for slug:", slug);
      return (
        <main className="space-y-0">
          <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
                <h1 className="text-3xl font-heading font-bold text-orange-800 mb-4">Location Not Found</h1>
                <p className="text-orange-600 mb-6">
                  We couldn&apos;t find a service area matching &quot;{slug}&quot;. This location may not be in our current service area.
                </p>
                <Link
                  href="/locations"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
                >
                  View All Service Areas
                </Link>
              </div>
            </div>
          </section>
        </main>
      );
    }

    // Fetch services for this city
    console.log("Fetching services for city ID:", citylocation.id);
    const { serviceLocations } = await client.request<{
      serviceLocations: {
        id: string;
        service: {
          id: string;
          name: string;
          slug: string;
          shortDesc: string;
        } | null;
      }[];
    }>(SERVICES_BY_CITY, { cityId: citylocation.id });

    console.log("Service locations loaded:", serviceLocations.length);
    console.log("Service locations data:", JSON.stringify(serviceLocations, null, 2));

    // Filter out service locations with null services
    const validServiceLocations = serviceLocations.filter(sl => sl.service !== null);
    console.log("Valid service locations after filtering:", validServiceLocations.length);

    const city = citylocation.city;
    console.log("City found:", city);

    return (
      <main className="space-y-0">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 via-gray-900 to-black text-white py-24 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Services in {city}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              BSB Tractor Services is proud to serve {city} with professional land clearing, 
              stump grinding, and junk removal services.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6 text-center">
              Available Services
            </h2>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Professional services available in {city}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {validServiceLocations.map((sl) => (
                <div
                  key={sl.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-xl transition"
                >
                  <div className="flex items-start mb-4">
                    <svg
                      className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                    <h3 className="text-xl font-heading font-semibold text-gray-900">
                      {sl.service.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {sl.service.shortDesc}
                  </p>
                  <div className="text-center">
                    <Link
                      href={`/services/${sl.service.slug}`}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local Contact CTA */}
        <section className="bg-gradient-to-r from-red-600 via-gray-900 to-black text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Get Started in {city}?
            </h2>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              Contact BSB Tractor Services today for a free quote on any of our services in {city}. 
              We&apos;re here to help with your next project.
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
    console.error("Error fetching services by city:", err);
    return (
      <main className="space-y-0">
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <h1 className="text-3xl font-heading font-bold text-red-800 mb-4">Service Area Unavailable</h1>
              <p className="text-red-600 mb-6">
                We hit a problem loading this location. Please try again or contact us for assistance.
              </p>
              <Link
                href="/locations"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
              >
                View All Service Areas
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

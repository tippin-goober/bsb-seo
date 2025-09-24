import Link from "next/link";
import client from "@/lib/hygraph";
import { gql } from "graphql-request";

type CityLocation = {
  id: string;
  city: string;
  slug: string;
};

const ALL_CITYLOCATIONS = gql`
  query AllCitylocations {
    citylocations {
      id
      city
      slug
    }
  }
`;

export default async function LocationsPage() {
  console.log("Rendering LocationsPage");
  
  try {
    console.log("Fetching locations data from Hygraph...");
    const data = await client.request<{ citylocations: CityLocation[] }>(
      ALL_CITYLOCATIONS
    );
    const cities = data?.citylocations ?? [];
    
    console.log("Locations data loaded:", { citiesCount: cities?.length });

    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center py-16 mb-16">
          <h1 className="text-5xl font-bold text-heading mb-6 text-gray-900">
            Service Areas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            BSB Tractor Services proudly serves communities throughout Volusia County. 
            Find your city below to learn more about our local services.
          </p>
        </section>

        {/* Locations Grid */}
        <section>
          {cities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No locations found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/locations/${city.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-brand/20 hover:-translate-y-1 text-center"
                >
                  <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand/20 transition-colors duration-200">
                    <svg
                      className="w-6 h-6 text-brand"
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
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand transition-colors duration-200">
                    {city.city}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Learn about our services
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-brand to-brand-dark p-12 rounded-2xl text-center text-white shadow-2xl mt-20">
          <h2 className="text-4xl font-bold text-heading mb-6">
            Don&apos;t See Your City?
          </h2>
          <p className="text-xl mb-8 text-brand-light max-w-2xl mx-auto leading-relaxed">
            We&apos;re always expanding our service areas. Contact us to see if we can help with your project.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-brand px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200 font-bold text-lg"
          >
            Contact Us
          </Link>
        </section>
      </main>
    );
  } catch (err) {
    console.error("Locations GraphQL fetch failed:", err);
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Areas</h1>
          <p className="text-red-600">
            We hit a problem loading locations. Please try again.
          </p>
        </div>
      </main>
    );
  }
}

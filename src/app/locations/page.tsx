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
  try {
    const data = await client.request<{ citylocations: CityLocation[] }>(
      ALL_CITYLOCATIONS
    );
    const cities = data?.citylocations ?? [];

    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Service Areas</h1>

        {cities.length === 0 ? (
          <p>No locations found.</p>
        ) : (
          <ul className="space-y-2">
            {cities.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/locations/${c.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {c.city}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    );
  } catch (err) {
    console.error("Error fetching citylocations:", err);
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Service Areas</h1>
        <p className="text-red-600">
          We hit a problem loading locations. Please try again.
        </p>
      </main>
    );
  }
}

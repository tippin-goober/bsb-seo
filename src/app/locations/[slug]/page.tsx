import Link from "next/link";
import client from "@/lib/hygraph";
import { gql } from "graphql-request";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SERVICES_BY_CITY = gql`
  query ServicesByCity($slug: String!) {
    serviceLocations(where: { cityLocation: { slug: $slug } }) {
      id
      service {
        id
        name
        slug
        shortDesc
      }
      cityLocation {
        city
        slug
      }
    }
  }
`;

interface Props {
  params: { slug: string };
}

// ✅ Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { serviceLocations } = await client.request<{
      serviceLocations: {
        id: string;
        service: { name: string };
        cityLocation: { city: string };
      }[];
    }>(SERVICES_BY_CITY, { slug: params.slug });

    if (!serviceLocations || serviceLocations.length === 0) return {};

    const city = serviceLocations[0].cityLocation.city;

    return {
      title: `Service Areas: ${city} | BSB Tractor Services`,
      description: `BSB Tractor Services in ${city}: land clearing, stump grinding, junk removal, and more.`,
    };
  } catch {
    return {};
  }
}

export default async function LocationPage({ params }: Props) {
  try {
    const { serviceLocations } = await client.request<{
      serviceLocations: {
        id: string;
        service: {
          id: string;
          name: string;
          slug: string;
          shortDesc: string;
        };
        cityLocation: { city: string; slug: string };
      }[];
    }>(SERVICES_BY_CITY, { slug: params.slug });

    if (!serviceLocations || serviceLocations.length === 0) {
      return notFound();
    }

    const city = serviceLocations[0].cityLocation.city;

    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Services in {city}</h1>

        <ul className="space-y-4">
          {serviceLocations.map((sl) => (
            <li key={sl.id}>
              <Link
                href={`/services/${sl.service.slug}`}
                className="text-blue-600 hover:underline"
              >
                {sl.service.name}
              </Link>
              <p className="text-gray-600 text-sm">{sl.service.shortDesc}</p>
            </li>
          ))}
        </ul>
      </main>
    );
  } catch (err) {
    console.error("Error fetching services by city:", err);
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Service Area</h1>
        <p className="text-red-600">
          We hit a problem loading this location. Please try again.
        </p>
      </main>
    );
  }
}

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
    const { services } = await client.request<{ services: Service[] }>(
      ALL_SERVICES
    );

    const service = services.find((s) => s.slug === params.slug);
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
  try {
    const { services } = await client.request<{ services: Service[] }>(
      ALL_SERVICES
    );

    const service = services.find((s) => s.slug === params.slug);
    if (!service) return notFound();

    const { serviceLocations } = await client.request<{
      serviceLocations: ServiceLocation[];
    }>(LOCATIONS_BY_SERVICE, { id: service.id });

    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">{service.name}</h1>
        <p className="mb-4">{service.shortDesc}</p>

        {serviceLocations && serviceLocations.length > 0 ? (
          <div className="mb-4">
            <p className="font-semibold">Available in:</p>
            <ul className="flex flex-wrap gap-2">
              {serviceLocations.map(
                (sl) =>
                  sl.cityLocation && (
                    <li key={sl.id}>
                      <Link
                        href={`/locations/${sl.cityLocation.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {sl.cityLocation.city}
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </div>
        ) : (
          <p className="mb-4 text-gray-600">No cities assigned yet.</p>
        )}

        {service.faqs?.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-2">FAQs</h2>
            <ul className="space-y-4">
              {service.faqs.map((faq, i) => (
                <li key={i}>
                  <strong>{faq.question}</strong>
                  <p>{faq.answer}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    );
  } catch (err) {
    console.error("Error fetching service:", err);
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Service</h1>
        <p className="text-red-600">
          We hit a problem loading this service. Please try again.
        </p>
      </main>
    );
  }
}

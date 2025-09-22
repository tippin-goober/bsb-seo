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
  try {
    const { services } = await client.request<{ services: any[] }>(
      ALL_SERVICES
    );

    return (
      <main>
        <h1>Our Services</h1>
        <ul>
          {services.map((s) => (
            <li key={s.id} style={{ marginBottom: "1rem" }}>
              <h2>
                <Link href={`/services/${s.slug}`}>{s.name}</Link>
              </h2>
              <p>{s.shortDesc}</p>
            </li>
          ))}
        </ul>
      </main>
    );
  } catch (err) {
    console.error("GraphQL Error:", err);
    return <main>Error loading services. Check console.</main>;
  }
}

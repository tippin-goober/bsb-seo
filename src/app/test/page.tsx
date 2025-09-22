import client from "@/lib/hygraph";
import { gql } from "graphql-request";

const query = gql`
  {
    services {
      id
      name
      slug
    }
  }
`;

export default async function TestPage() {
  try {
    console.log("Running GraphQL query for services...");
    const data = await client.request(query);
    console.log("GraphQL response data:", JSON.stringify(data, null, 2));

    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Services from Hygraph</h1>
        {data.services && data.services.length > 0 ? (
          <ul className="space-y-2">
            {data.services.map((service: any) => (
              <li key={service.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="font-semibold">{service.name}</div>
                <div className="text-sm text-gray-600">Slug: {service.slug}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No services found.</p>
        )}
      </main>
    );
  } catch (err) {
    console.error("GraphQL error:", err);
    console.error("Full error details:", JSON.stringify(err, null, 2));
    
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Error Loading Data</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold mb-2">Failed to fetch services from Hygraph</p>
          <p className="text-red-700 text-sm">
            Check the terminal/console for detailed error information.
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-red-600 text-sm">Error Details</summary>
            <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
              {err instanceof Error ? err.message : String(err)}
            </pre>
          </details>
        </div>
      </main>
    );
  }
}

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // 👈 force load .env.local

console.log("HYGRAPH_ENDPOINT:", process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT);
console.log(
  "HYGRAPH_TOKEN:",
  process.env.NEXT_PUBLIC_HYGRAPH_TOKEN ? "***set***" : "undefined"
);

import { GraphQLClient, gql } from "graphql-request";

// ✅ load env variables
const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT as string;
const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN as string;
const DRY_RUN = process.env.DRY_RUN === "true";

const client = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// ✅ Queries
const ALL_SERVICES = gql`
  query {
    services {
      id
      name
      slug
    }
  }
`;

const ALL_CITIES = gql`
  query {
    citylocations {
      id
      city
      slug
    }
  }
`;

const GET_SERVICELOCATION = gql`
  query GetServiceLocation($serviceId: ID!, $cityId: ID!) {
    serviceLocations(
      where: {
        service: { id: $serviceId }
        cityLocation: { id: $cityId }
      }
    ) {
      id
    }
  }
`;

const CREATE_SERVICELOCATION = gql`
  mutation CreateServiceLocation($serviceId: ID!, $cityId: ID!) {
    createServiceLocation(
      data: {
        service: { connect: { id: $serviceId } }
        cityLocation: { connect: { id: $cityId } }
      }
    ) {
      id
    }
  }
`;

const PUBLISH_SERVICELOCATION = gql`
  mutation PublishServiceLocation($id: ID!) {
    publishServiceLocation(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`;

async function main() {
  let createdCount = 0;
  let publishedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    const { services } = await client.request<{
      services: { id: string; name: string }[];
    }>(ALL_SERVICES);

    const { citylocations } = await client.request<{
      citylocations: { id: string; city: string }[];
    }>(ALL_CITIES);

    console.log(`Found ${services.length} services and ${citylocations.length} cities.`);
    if (DRY_RUN) console.log("🚧 DRY RUN MODE ENABLED (no changes will be made)");

    for (const service of services) {
      for (const city of citylocations) {
        try {
          const { serviceLocations } = await client.request<{
            serviceLocations: { id: string }[];
          }>(GET_SERVICELOCATION, {
            serviceId: service.id,
            cityId: city.id,
          });

          if (serviceLocations.length > 0) {
            const existingId = serviceLocations[0].id;
            if (!DRY_RUN) {
              await client.request(PUBLISH_SERVICELOCATION, { id: existingId });
            }
            console.log(`⚠️ Already exists, published: ${service.name} → ${city.city}`);
            skippedCount++;
          } else {
            if (!DRY_RUN) {
              const created = await client.request(CREATE_SERVICELOCATION, {
                serviceId: service.id,
                cityId: city.id,
              });
              await client.request(PUBLISH_SERVICELOCATION, {
                id: created.createServiceLocation.id,
              });
            }
            console.log(`✅ Created & Published: ${service.name} → ${city.city}`);
            createdCount++;
            publishedCount++;
          }
        } catch (err: any) {
          console.error("❌ Error:", err.response?.errors ?? err);
          errorCount++;
        }
      }
    }

    console.log("--------- SUMMARY ---------");
    console.log(`✅ Created: ${createdCount}`);
    console.log(`📢 Published: ${publishedCount}`);
    console.log(`⚠️ Skipped (already exists): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log("---------------------------");
    console.log("✅ Seeding complete!");
  } catch (err) {
    console.error("❌ Script failed:", err);
  }
}

main();

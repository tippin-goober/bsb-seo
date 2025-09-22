"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
// ✅ load env variables
const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;
const client = new graphql_request_1.GraphQLClient(endpoint, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
// ✅ Queries
const ALL_SERVICES = (0, graphql_request_1.gql) `
  query {
    services {
      id
      name
      slug
    }
  }
`;
const ALL_CITIES = (0, graphql_request_1.gql) `
  query {
    citylocations {
      id
      city
      slug
    }
  }
`;
// ✅ Mutation to create ServiceLocation
const CREATE_SERVICELOCATION = (0, graphql_request_1.gql) `
  mutation CreateServiceLocation($serviceId: ID!, $cityId: ID!) {
    createServiceLocation(
      data: { service: { connect: { id: $serviceId } }, cityLocation: { connect: { id: $cityId } } }
    ) {
      id
    }
  }
`;
async function main() {
    var _a, _b, _c;
    try {
        // 1. Fetch all services and cities
        const { services } = await client.request(ALL_SERVICES);
        const { citylocations } = await client.request(ALL_CITIES);
        console.log(`Found ${services.length} services and ${citylocations.length} cities.`);
        // 2. Loop through all combinations
        for (const service of services) {
            for (const city of citylocations) {
                console.log(`Creating ServiceLocation: ${service.name} → ${city.city}`);
                try {
                    await client.request(CREATE_SERVICELOCATION, {
                        serviceId: service.id,
                        cityId: city.id,
                    });
                }
                catch (err) {
                    // skip if already exists
                    if ((_c = (_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message.includes("already exists")) {
                        console.log(`⚠️ Already exists: ${service.name} → ${city.city}`);
                    }
                    else {
                        console.error("❌ Error creating:", err);
                    }
                }
            }
        }
        console.log("✅ Seeding complete!");
    }
    catch (err) {
        console.error("❌ Script failed:", err);
    }
}
main();

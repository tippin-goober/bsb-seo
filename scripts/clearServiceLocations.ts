import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { GraphQLClient, gql } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT as string;
const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN as string;

const client = new GraphQLClient(endpoint, {
  headers: { Authorization: `Bearer ${token}` },
});

const GET_ALL = gql`
  query {
    serviceLocations {
      id
    }
  }
`;

const DELETE_ONE = gql`
  mutation DeleteServiceLocation($id: ID!) {
    deleteServiceLocation(where: { id: $id }) {
      id
    }
  }
`;

async function main() {
  try {
    const { serviceLocations } = await client.request<{ serviceLocations: { id: string }[] }>(
      GET_ALL
    );

    console.log(`Found ${serviceLocations.length} ServiceLocations to delete.`);

    for (const { id } of serviceLocations) {
      await client.request(DELETE_ONE, { id });
      console.log(`🗑️ Deleted ${id}`);
    }

    console.log("✅ Cleanup complete!");
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
  }
}

main();

import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;

// Log raw values with JSON.stringify for debugging
console.log("NEXT_PUBLIC_HYGRAPH_ENDPOINT:", JSON.stringify(endpoint));
console.log("NEXT_PUBLIC_HYGRAPH_TOKEN:", JSON.stringify(token));

if (!endpoint) {
  throw new Error("❌ NEXT_PUBLIC_HYGRAPH_ENDPOINT is missing. Check .env.local");
}
if (!token) {
  throw new Error("❌ NEXT_PUBLIC_HYGRAPH_TOKEN is missing. Check .env.local");
}

const client = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default client;

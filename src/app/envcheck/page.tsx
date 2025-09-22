export default function EnvCheckPage() {
  const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
  const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;
  
  const tokenPreview = token ? `${token.substring(0, 20)}...` : "Not set";

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Check</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-50 border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">NEXT_PUBLIC_HYGRAPH_ENDPOINT</h2>
          <div className="font-mono text-sm bg-white p-2 rounded border">
            {endpoint || "❌ Not set"}
          </div>
        </div>
        
        <div className="bg-gray-50 border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">NEXT_PUBLIC_HYGRAPH_TOKEN</h2>
          <div className="font-mono text-sm bg-white p-2 rounded border">
            {tokenPreview}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Showing first 20 characters for security
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Status</h3>
          <div className="space-y-1 text-sm">
            <div className={endpoint ? "text-green-600" : "text-red-600"}>
              {endpoint ? "✅ Endpoint is set" : "❌ Endpoint is missing"}
            </div>
            <div className={token ? "text-green-600" : "text-red-600"}>
              {token ? "✅ Token is set" : "❌ Token is missing"}
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Next Steps</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• If either variable is missing, check your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file</li>
            <li>• Make sure the file is in the project root directory</li>
            <li>• Restart your development server after making changes</li>
            <li>• Visit <a href="/test" className="text-blue-600 underline">/test</a> to test the GraphQL connection</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-red-500">Auth Error</h1>
        <p className="text-white/60">
          There was an error exchanging the authorization code for a session. 
          This could be due to an expired or invalid code.
        </p>
        <a 
          href="/login" 
          className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}

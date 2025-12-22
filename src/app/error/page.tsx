export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-red-500">Oops!</h1>
        <p className="text-white/60">
          Something went wrong during the authentication process. 
          Please try again or contact support if the issue persists.
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

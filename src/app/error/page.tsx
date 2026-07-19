export default function ErrorPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-destructive">Oops!</h1>
        <p className="text-muted-foreground">
          Something went wrong during the authentication process.
          Please try again or contact support if the issue persists.
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl transition-colors"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}

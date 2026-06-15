"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function PostError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error("Post page error:", error)
	}, [error])

	return (
		<main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div className="bg-card rounded-xl border border-border/50 p-6 sm:p-10 text-center max-w-lg mx-auto">
				<div className="mb-6">
					<svg
						className="w-14 h-14 text-destructive mx-auto"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
					Couldn&apos;t load this post
				</h2>
				<p className="text-sm sm:text-base text-muted-foreground mb-8">
					Something went wrong while loading the post. You can try again or go back to the feed.
				</p>
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						type="button"
						onClick={reset}
						className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
					>
						Try again
					</button>
					<Link
						href="/posts"
						className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
					>
						Back to posts
					</Link>
				</div>
				{error.digest && (
					<p className="mt-6 text-xs text-muted-foreground">Error ID: {error.digest}</p>
				)}
			</div>
		</main>
	)
}

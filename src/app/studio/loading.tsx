/**
 * Studio Loading State
 * Displays animated skeleton cards while the studio page loads.
 */
export default function StudioLoading() {
	return (
		<section className="w-full mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-8 space-y-16 min-h-screen animate-in fade-in duration-300">
			{/* Header Skeleton */}
			<div className="text-center max-w-3xl mx-auto space-y-4">
				<div className="h-4 w-24 bg-muted/30 rounded-full mx-auto animate-pulse" />
				<div className="h-12 w-64 bg-muted/20 rounded-xl mx-auto animate-pulse" />
				<div className="h-5 w-80 max-w-full bg-muted/15 rounded-lg mx-auto animate-pulse" />
			</div>

			{/* Build Cards Skeleton */}
			<div className="grid md:grid-cols-2 gap-8">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="p-8 rounded-2xl border border-border bg-card/40 animate-pulse"
						style={{ animationDelay: `${i * 120}ms` }}
					>
						{/* Title + Status Badge */}
						<div className="flex items-center justify-between mb-4">
							<div className="h-7 w-40 rounded-lg bg-muted/25" />
							<div className="h-6 w-24 rounded-full bg-muted/20" />
						</div>

						{/* Description */}
						<div className="space-y-2 mb-6">
							<div className="h-3.5 w-full rounded bg-muted/15" />
							<div className="h-3.5 w-5/6 rounded bg-muted/15" />
							<div className="h-3.5 w-3/4 rounded bg-muted/15" />
						</div>

						{/* Tech Tags */}
						<div className="flex flex-wrap gap-2 mb-6">
							{[1, 2, 3, 4].map((j) => (
								<div key={j} className="h-6 w-16 rounded-lg bg-muted/15" />
							))}
						</div>

						{/* Footer */}
						<div className="flex items-center justify-between pt-4 border-t border-border">
							<div className="h-3 w-20 rounded bg-muted/15" />
							<div className="flex gap-2">
								<div className="w-8 h-8 rounded-lg bg-muted/15" />
								<div className="w-8 h-8 rounded-lg bg-muted/15" />
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

/**
 * Services Loading State
 * Displays animated skeleton cards while the services page loads.
 */
export default function ServicesLoading() {
	return (
		<section className="w-full mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-8 space-y-16 min-h-screen animate-in fade-in duration-300">
			{/* Header Skeleton */}
			<div className="text-center max-w-3xl mx-auto space-y-4">
				<div className="h-4 w-20 bg-muted/30 rounded-full mx-auto animate-pulse" />
				<div className="h-12 w-72 bg-muted/20 rounded-xl mx-auto animate-pulse" />
				<div className="h-5 w-96 max-w-full bg-muted/15 rounded-lg mx-auto animate-pulse" />
			</div>

			{/* Service Cards Skeleton */}
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className="p-8 rounded-2xl border border-border bg-card/40 animate-pulse"
						style={{ animationDelay: `${i * 100}ms` }}
					>
						{/* Icon */}
						<div className="w-14 h-14 rounded-xl bg-muted/20 mb-5" />

						{/* Title */}
						<div className="h-6 w-36 rounded-lg bg-muted/25 mb-3" />

						{/* Description */}
						<div className="space-y-2 mb-4">
							<div className="h-3.5 w-full rounded bg-muted/15" />
							<div className="h-3.5 w-4/5 rounded bg-muted/15" />
						</div>

						{/* Feature List */}
						<div className="space-y-2 mb-6">
							{[1, 2, 3, 4].map((j) => (
								<div key={j} className="flex items-center gap-2">
									<div className="w-4 h-4 rounded-full bg-muted/15" />
									<div className="h-3 w-24 rounded bg-muted/15" />
								</div>
							))}
						</div>

						{/* Price */}
						<div className="pt-4 border-t border-border">
							<div className="h-8 w-32 rounded-lg bg-[#DAA520]/10" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

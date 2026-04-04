/**
 * Home Loading State  
 * Displays branded skeleton while the home page loads.
 */
export default function HomeLoading() {
	return (
		<main className="space-y-32 px-4 md:px-10 py-16 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-300">
			{/* Hero Skeleton */}
			<section className="text-center pt-8 md:pt-16 space-y-6">
				<div className="h-4 w-64 bg-muted/30 rounded-full mx-auto animate-pulse" />
				<div className="space-y-3">
					<div className="h-14 w-96 max-w-full bg-muted/20 rounded-2xl mx-auto animate-pulse" />
					<div className="h-14 w-80 max-w-full bg-muted/15 rounded-2xl mx-auto animate-pulse" />
				</div>
				<div className="h-5 w-md max-w-full bg-muted/10 rounded-lg mx-auto animate-pulse" />
				<div className="flex justify-center gap-4 pt-4">
					<div className="h-14 w-48 rounded-xl bg-[#DAA520]/10 animate-pulse" />
					<div className="h-14 w-40 rounded-xl bg-muted/10 animate-pulse" />
				</div>
			</section>

			{/* Services Snapshot Skeleton */}
			<section className="space-y-8">
				<div className="text-center space-y-3">
					<div className="h-9 w-40 bg-muted/20 rounded-xl mx-auto animate-pulse" />
					<div className="h-4 w-64 bg-muted/15 rounded-lg mx-auto animate-pulse" />
				</div>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="p-8 rounded-2xl border border-border bg-card/40 animate-pulse"
							style={{ animationDelay: `${i * 100}ms` }}
						>
							<div className="w-14 h-14 rounded-xl bg-muted/15 mb-5" />
							<div className="h-6 w-32 rounded-lg bg-muted/20 mb-3" />
							<div className="space-y-2">
								<div className="h-3.5 w-full rounded bg-muted/10" />
								<div className="h-3.5 w-4/5 rounded bg-muted/10" />
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Featured Projects Skeleton */}
			<section className="space-y-8">
				<div className="text-center space-y-3">
					<div className="h-9 w-48 bg-muted/20 rounded-xl mx-auto animate-pulse" />
					<div className="h-4 w-80  max-w-full bg-muted/15 rounded-lg mx-auto animate-pulse" />
				</div>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="p-8 rounded-2xl border border-border bg-card/40 animate-pulse h-48"
							style={{ animationDelay: `${i * 120}ms` }}
						>
							<div className="flex items-center justify-between mb-4">
								<div className="h-6 w-28 rounded-lg bg-muted/20" />
								<div className="h-5 w-20 rounded-full bg-muted/15" />
							</div>
							<div className="space-y-2 mb-4">
								<div className="h-3.5 w-full rounded bg-muted/10" />
								<div className="h-3.5 w-3/4 rounded bg-muted/10" />
							</div>
							<div className="h-3 w-20 rounded bg-muted/10 mt-auto" />
						</div>
					))}
				</div>
			</section>
		</main>
	);
}

/**
 * Profile Loading State
 * Displays animated skeleton while the profile page data loads.
 */
export default function ProfileLoading() {
	return (
		<section className="w-full mx-auto max-w-6xl px-4 py-8 md:py-12 md:px-8 space-y-12 min-h-screen animate-in fade-in duration-300">
			{/* Hero Skeleton */}
			<div className="p-8 rounded-3xl border border-border bg-card/30 backdrop-blur-sm">
				<div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
					{/* Avatar */}
					<div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted/20 animate-pulse shrink-0" />

					{/* Info */}
					<div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 max-w-2xl w-full">
						<div className="h-10 w-64 rounded-xl bg-muted/20 animate-pulse" />
						<div className="h-5 w-80 max-w-full rounded-lg bg-muted/15 animate-pulse" />
						<div className="space-y-2 w-full max-w-lg">
							<div className="h-4 w-full rounded bg-muted/10 animate-pulse" />
							<div className="h-4 w-5/6 rounded bg-muted/10 animate-pulse" />
							<div className="h-4 w-4/6 rounded bg-muted/10 animate-pulse" />
						</div>

						{/* Stat Cards */}
						<div className="flex flex-wrap gap-3 pt-4">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="h-16 w-28 rounded-xl bg-muted/10 border border-border animate-pulse"
									style={{ animationDelay: `${i * 80}ms` }}
								/>
							))}
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3 pt-2">
							<div className="h-11 w-36 rounded-xl bg-[#DAA520]/10 animate-pulse" />
							<div className="h-11 w-32 rounded-xl bg-muted/10 animate-pulse" />
						</div>
					</div>
				</div>
			</div>

			{/* Tech Stack Skeleton */}
			<div className="space-y-4">
				<div className="h-7 w-32 rounded-lg bg-muted/20 animate-pulse" />
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
					{Array.from({ length: 16 }).map((_, i) => (
						<div
							key={i}
							className="h-20 rounded-xl bg-muted/10 border border-border animate-pulse"
							style={{ animationDelay: `${i * 40}ms` }}
						/>
					))}
				</div>
			</div>

			{/* Experience Timeline Skeleton */}
			<div className="space-y-4">
				<div className="h-7 w-40 rounded-lg bg-muted/20 animate-pulse" />
				<div className="space-y-6">
					{[1, 2, 3].map((i) => (
						<div key={i} className="p-6 rounded-2xl border border-border bg-card/30 animate-pulse">
							<div className="flex items-center gap-4 mb-3">
								<div className="w-10 h-10 rounded-full bg-muted/15" />
								<div className="space-y-2">
									<div className="h-5 w-48 rounded bg-muted/20" />
									<div className="h-3 w-32 rounded bg-muted/10" />
								</div>
							</div>
							<div className="space-y-2">
								<div className="h-3.5 w-full rounded bg-muted/10" />
								<div className="h-3.5 w-3/4 rounded bg-muted/10" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

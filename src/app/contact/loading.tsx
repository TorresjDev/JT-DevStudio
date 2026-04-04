/**
 * Contact Loading State
 * Displays animated skeleton while the contact page loads.
 */
export default function ContactLoading() {
	return (
		<section className="w-full mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-8 space-y-12 min-h-screen animate-in fade-in duration-300">
			{/* Header Skeleton */}
			<div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
				<div className="h-4 w-20 bg-muted/30 rounded-full animate-pulse" />
				<div className="h-12 w-72 bg-muted/20 rounded-xl animate-pulse" />
				<div className="h-5 w-80 max-w-full bg-muted/15 rounded-lg animate-pulse" />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
				{/* Sidebar Skeleton */}
				<div className="p-6 rounded-2xl border border-border bg-card/30 animate-pulse space-y-4">
					<div className="h-6 w-36 rounded-lg bg-muted/20" />
					<div className="h-4 w-full rounded bg-muted/10" />
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/5">
								<div className="w-10 h-10 rounded-lg bg-muted/15" />
								<div className="space-y-1.5">
									<div className="h-4 w-16 rounded bg-muted/15" />
									<div className="h-3 w-36 rounded bg-muted/10" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Form Skeleton */}
				<div className="lg:col-span-2 p-6 md:p-8 rounded-2xl border border-border bg-card/30 animate-pulse space-y-5">
					{/* Row 1 */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="h-3.5 w-12 rounded bg-muted/15" />
							<div className="h-12 w-full rounded-xl bg-muted/10" />
						</div>
						<div className="space-y-2">
							<div className="h-3.5 w-12 rounded bg-muted/15" />
							<div className="h-12 w-full rounded-xl bg-muted/10" />
						</div>
					</div>

					{/* Row 2 */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="h-3.5 w-28 rounded bg-muted/15" />
							<div className="h-12 w-full rounded-xl bg-muted/10" />
						</div>
						<div className="space-y-2">
							<div className="h-3.5 w-24 rounded bg-muted/15" />
							<div className="h-12 w-full rounded-xl bg-muted/10" />
						</div>
					</div>

					{/* Row 3 */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="h-3.5 w-24 rounded bg-muted/15" />
							<div className="h-12 w-full rounded-xl bg-muted/10" />
						</div>
						<div className="space-y-2">
							<div className="h-3.5 w-16 rounded bg-muted/15" />
							<div className="h-12 w-full rounded-xl bg-muted/10" />
						</div>
					</div>

					{/* Textarea */}
					<div className="space-y-2">
						<div className="h-3.5 w-32 rounded bg-muted/15" />
						<div className="h-32 w-full rounded-xl bg-muted/10" />
					</div>

					{/* Submit Button */}
					<div className="h-14 w-full rounded-xl bg-[#DAA520]/10" />
				</div>
			</div>
		</section>
	);
}

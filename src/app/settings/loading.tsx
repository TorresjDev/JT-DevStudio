/**
 * Settings Loading State
 * Displays animated skeleton while the settings page loads.
 */
export default function SettingsLoading() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] pt-16 animate-in fade-in duration-300">
			<div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-4">
				{/* Header */}
				<div className="mb-8 space-y-2">
					<div className="h-8 w-28 bg-muted/20 rounded-lg animate-pulse" />
					<div className="h-4 w-64 bg-muted/10 rounded animate-pulse" />
				</div>

				<div className="grid md:grid-cols-[240px_1fr] gap-6">
					{/* Sidebar Nav Skeleton */}
					<div className="bg-white/3 backdrop-blur-xl border border-white/8 rounded-2xl p-3 h-fit space-y-1">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl animate-pulse">
								<div className="w-4 h-4 rounded bg-muted/20" />
								<div className="h-4 w-24 rounded bg-muted/15" />
							</div>
						))}
					</div>

					{/* Content Skeleton */}
					<div className="bg-white/3 backdrop-blur-xl border border-white/8 rounded-2xl p-6 space-y-6">
						<div className="space-y-2">
							<div className="h-6 w-20 rounded bg-muted/20 animate-pulse" />
							<div className="h-4 w-56 rounded bg-muted/10 animate-pulse" />
						</div>

						{/* Form Fields */}
						<div className="space-y-5">
							{[1, 2].map((i) => (
								<div key={i} className="space-y-2">
									<div className="h-3 w-20 rounded bg-muted/15 animate-pulse" />
									<div className="h-11 w-full rounded-xl bg-muted/8 animate-pulse" />
								</div>
							))}
						</div>

						{/* Submit Button */}
						<div className="h-11 w-36 rounded-xl bg-blue-600/20 animate-pulse" />
					</div>
				</div>
			</div>
		</div>
	);
}

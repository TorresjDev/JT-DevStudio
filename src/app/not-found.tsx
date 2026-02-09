import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4 text-center w-[90vw] lg:w-[69vw] max-w-[95vw] mx-auto">
			<h1 className="text-4xl font-bold text-abn/90">Page Not Found</h1>
			<img
				src="https://torresjdev.github.io/Nextjs-Asset-Host/assets/backgrounds/ui/404-not-found-transparent.png"
				alt="Not Found"
				className="mt-8 w-1/2"
				width={500}
				height={500}
				loading="lazy"
			/>

			<p className="mt-4 text-lg text-silver/60">
				We can&apos;t seem to find the page you&apos;re looking for.
			</p>
			<Link href="/" className="my-3 hover:!text-[#DAA520]">
				Go back home
			</Link>
		</div>
	);
}

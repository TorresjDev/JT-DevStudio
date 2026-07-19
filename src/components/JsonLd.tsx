// Structured data (schema.org JSON-LD) so search engines and AI systems can
// unambiguously identify this business and its founder, distinct from any
// unrelated same-named entities elsewhere on the web.
export function JsonLd() {
	const schema = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "ProfessionalService",
				"@id": "https://jt-devstudio.tech/#organization",
				name: "JT Dev Studio",
				url: "https://jt-devstudio.tech",
				description:
					"Freelance web development, original SaaS products, and technology services by Jesus Torres, based in Amarillo, Texas.",
				founder: { "@id": "https://jt-devstudio.tech/#founder" },
				address: {
					"@type": "PostalAddress",
					addressLocality: "Amarillo",
					addressRegion: "TX",
					addressCountry: "US",
				},
				sameAs: [
					"https://github.com/TorresjDev",
					"https://linkedin.com/in/torresjdev",
				],
			},
			{
				"@type": "Person",
				"@id": "https://jt-devstudio.tech/#founder",
				name: "Jesus Torres",
				jobTitle: "Founder & Software Engineer",
				url: "https://jt-devstudio.tech/profile",
				worksFor: { "@id": "https://jt-devstudio.tech/#organization" },
				sameAs: [
					"https://github.com/TorresjDev",
					"https://linkedin.com/in/torresjdev",
				],
			},
		],
	};

	return (
		<script
			type="application/ld+json"
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

import { env } from '@/lib/env';

type GithubRepo = {
	fork?: boolean;
	archived?: boolean;
	stargazers_count?: number;
	pushed_at?: string;
};

export async function getGitHubProfile(username?: string) {
	const githubUsername = username || env.NEXT_GITHUB_USERNAME;
	const response = await fetch(
		`https://api.github.com/users/${githubUsername}`,
		{
			headers: {
				Accept: "application/vnd.github+json",
			},
			next: {
				revalidate: 3600, // Revalidate every hour
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch GitHub profile");
	}

	return response.json();
}

export async function getGitHubRepos(username?: string) {
	const githubUsername = username || env.NEXT_GITHUB_USERNAME;
	// Pull up to 100 repos so we can rank them ourselves. The GitHub user-repos
	// endpoint can't sort by stars, so we sort client-side below.
	const response = await fetch(
		`https://api.github.com/users/${githubUsername}/repos?sort=pushed&per_page=100`,
		{
			headers: {
				Accept: "application/vnd.github+json",
			},
			next: {
				revalidate: 3600,
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch GitHub repos");
	}

	return response.json();
}

/**
 * Returns the user's own (non-fork, non-archived) repositories ranked by star
 * count, falling back to most-recently-pushed as a tiebreaker so the list still
 * surfaces meaningful work even when star counts are low.
 */
export async function getTopReposByStars(username?: string, limit = 6) {
	const repos = await getGitHubRepos(username);

	if (!Array.isArray(repos)) return [];

	return repos
		.filter((r: GithubRepo) => !r.fork && !r.archived)
		.sort((a: GithubRepo, b: GithubRepo) => {
			const stars = (b.stargazers_count || 0) - (a.stargazers_count || 0);
			if (stars !== 0) return stars;
			return (
				new Date(b.pushed_at ?? 0).getTime() - new Date(a.pushed_at ?? 0).getTime()
			);
		})
		.slice(0, limit);
}

export async function getGitHubReadme(username?: string) {
	const githubUsername = username || env.NEXT_GITHUB_USERNAME;
	const response = await fetch(
		`https://api.github.com/repos/${githubUsername}/${githubUsername}/readme`,
		{
			headers: {
				Accept: "application/vnd.github.raw",
			},
			next: {
				revalidate: 3600,
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch GitHub readme");
	}

	const rawText = await response.text();
	return parseTechStack(rawText);
}

function parseTechStack(readmeText: string): string | null {
	if (!readmeText) return null;

	// Match "## 💼 Technical Skill Set" up to the next heading or end
	const match = readmeText.match(/## 💼 Technical Skill Set\s+([\s\S]*?)(?=##|$)/i);
	if (!match) return null;

	let content = match[1].trim();

	// Inject Supabase Icon into Frameworks (2nd column / td count index 2)
	let count = 0;
	content = content.replace(/<\/td>/g, (matchStr) => {
		count++;
		if (count === 2) { // 2nd column: Frameworks
			return ` <img src="https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg" alt="Supabase" height="30" style="margin: 4px; display: inline-block; vertical-align: middle;"/></td>`;
		}
		return matchStr;
	});

	return content;
}

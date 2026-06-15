/**
 * Ownership helpers for UGC posts.
 * UI uses these to hide controls; server actions must verify separately.
 */
export function isPostAuthor(
	currentUserId: string | null | undefined,
	authorId: string,
): boolean {
	return Boolean(currentUserId && currentUserId === authorId)
}

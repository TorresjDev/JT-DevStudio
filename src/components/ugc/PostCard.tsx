'use client'

/**
 * Post Card Component
 *
 * Feed card with refined hover depth, subtle glow, and owner action polish.
 */

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { formatDistanceToNow } from './utils'
import { PostOwnerActions } from './PostOwnerActions'
import { UserAvatar } from './UserAvatar'
import { isPostAuthor } from '@/lib/ugc/postOwnership'
import type { PostWithAuthor } from '@/lib/ugc'

interface PostCardProps {
	post: PostWithAuthor
	showAuthor?: boolean
	index?: number
}

const HTML_ENTITY_MAP: Record<string, string> = {
	nbsp: ' ',
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	'#039': "'",
	apos: "'",
}

function stripHtmlTags(html: string): string {
	if (!html) return ''
	let result = ''
	let i = 0
	while (i < html.length) {
		if (html[i] === '<') {
			if (html.slice(i, i + 7).toLowerCase() === '<script') {
				const closeIndex = html.toLowerCase().indexOf('</script>', i + 7)
				i = closeIndex !== -1 ? closeIndex + 9 : html.length
				continue
			}
			if (html.slice(i, i + 6).toLowerCase() === '<style') {
				const closeIndex = html.toLowerCase().indexOf('</style>', i + 6)
				i = closeIndex !== -1 ? closeIndex + 8 : html.length
				continue
			}
			const closingBracket = html.indexOf('>', i)
			i = closingBracket !== -1 ? closingBracket + 1 : html.length
		} else {
			result += html[i]
			i++
		}
	}
	return result
}

function getPlainText(html: string): string {
	if (!html) return ''
	return stripHtmlTags(html)
		.replace(/&(#?[a-zA-Z0-9]+);/g, (match, entity) => HTML_ENTITY_MAP[entity] || match)
		.trim()
}

export function PostCard({ post, showAuthor = true, index = 0 }: PostCardProps) {
	const { user } = useAuth()
	const plainText = getPlainText(post.content)
	const excerpt =
		plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
	const isOwner = isPostAuthor(user?.id, post.author_id)

	return (
		<motion.article
			initial={{ opacity: 0, y: 14 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.38,
				delay: Math.min(index * 0.05, 0.25),
				ease: [0.22, 1, 0.36, 1],
			}}
			className="group relative hover-lift"
		>
			{/* Hover glow ring */}
			<div
				aria-hidden
				className="pointer-events-none absolute -inset-px rounded-xl bg-linear-to-br from-primary/0 via-primary/0 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:from-[#DAA520]/20 group-hover:via-[#DAA520]/5 group-hover:to-transparent group-hover:opacity-100"
			/>

			<div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-[border-color,box-shadow] duration-300 sm:p-5 md:p-6 group-hover:border-[#DAA520]/30 group-hover:shadow-lg group-hover:shadow-[#DAA520]/10">
				{/* Category + status */}
				<div className="mb-3 flex items-center gap-2">
					<span className="rounded-full bg-[#DAA520]/10 px-2.5 py-1 text-xs font-medium capitalize text-[#DAA520] transition-colors duration-200 group-hover:bg-[#DAA520]/15">
						{post.category}
					</span>
					{post.status === 'draft' && (
						<span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-500">
							Draft
						</span>
					)}
				</div>

				<Link href={`/posts/${post.id}`} className="relative z-[1] block min-w-0">
					<h2 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors duration-200 sm:text-xl group-hover:text-[#DAA520]">
						{post.title}
					</h2>
				</Link>

				<p className="relative z-[1] mb-4 line-clamp-3 text-sm text-muted-foreground transition-colors duration-200 group-hover:text-muted-foreground/90">
					{excerpt}
				</p>

				{/* Read hint — fades in on hover (desktop) */}
				<p className="pointer-events-none absolute right-6 top-6 z-[1] hidden text-[10px] font-semibold uppercase tracking-wider text-primary/0 transition-all duration-300 group-hover:text-[#DAA520]/80 md:block">
					Read →
				</p>

				<div className="relative z-[1] flex min-w-0 flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3 sm:pt-4">
					{showAuthor && post.author && (
						<div className="flex min-w-0 max-w-[70%] items-center gap-2 sm:max-w-none sm:gap-3">
							<UserAvatar
								avatarUrl={post.author.avatar_url}
								displayName={post.author.display_name}
								username={post.author.username}
							/>
							<span className="truncate text-sm font-medium text-foreground">
								{post.author.display_name || post.author.username || 'Anonymous'}
							</span>
						</div>
					)}
					<time
						dateTime={post.created_at}
						className="shrink-0 text-xs text-muted-foreground"
						title={new Date(post.created_at).toLocaleString()}
					>
						{formatDistanceToNow(post.created_at)}
					</time>
				</div>

				{isOwner && (
					<PostOwnerActions
						postId={post.id}
						authorId={post.author_id}
						currentUserId={user?.id ?? null}
						category={post.category}
						variant="card"
					/>
				)}

				<Link
					href={`/posts/${post.id}`}
					className="absolute inset-0 z-0 rounded-xl"
					aria-label={`Read more: ${post.title}`}
				/>
			</div>
		</motion.article>
	)
}

export function PostCardSkeleton() {
	return (
		<article className="animate-pulse rounded-xl border border-border/50 bg-card p-6">
			<div className="mb-3 h-6 w-16 rounded-full ui-shimmer-line" />
			<div className="mb-2 h-7 w-3/4 rounded ui-shimmer-line" />
			<div className="mb-4 space-y-2">
				<div className="h-4 w-full rounded ui-shimmer-line" />
				<div className="h-4 w-5/6 rounded ui-shimmer-line" />
				<div className="h-4 w-2/3 rounded ui-shimmer-line" />
			</div>
			<div className="flex items-center justify-between border-t border-border/50 pt-4">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 rounded-full ui-shimmer-line" />
					<div className="h-4 w-24 rounded ui-shimmer-line" />
				</div>
				<div className="h-3 w-20 rounded ui-shimmer-line" />
			</div>
		</article>
	)
}

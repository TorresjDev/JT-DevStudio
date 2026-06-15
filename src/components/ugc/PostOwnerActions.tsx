'use client'

/**
 * Edit and delete controls for the post author.
 * Mobile-first: full-width touch targets on narrow screens.
 */

import { useState, useTransition, type MouseEvent } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { deletePost, type PostCategory } from '@/lib/ugc'
import { isPostAuthor } from '@/lib/ugc/postOwnership'
import { getPostListPath, getPostTypeLabel } from '@/lib/ugc/postPaths'
import { fadeUp, springSnappy } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface PostOwnerActionsProps {
	postId: string
	authorId: string
	currentUserId?: string | null
	category: PostCategory
	variant?: 'detail' | 'card'
	className?: string
}

const actionButtonBase =
	'touch-target-inline ui-press inline-flex items-center justify-center gap-1.5 font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none'

export function PostOwnerActions({
	postId,
	authorId,
	currentUserId,
	category,
	variant = 'detail',
	className,
}: PostOwnerActionsProps) {
	const [showConfirm, setShowConfirm] = useState(false)
	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string | null>(null)

	if (!isPostAuthor(currentUserId, authorId)) {
		return null
	}

	const redirectTo = getPostListPath(category)
	const typeLabel = getPostTypeLabel(category)
	const isCard = variant === 'card'

	const handleDelete = () => {
		setError(null)
		startTransition(async () => {
			const result = await deletePost(postId)
			if (result.success) {
				window.location.href = redirectTo
			} else {
				setError(result.error)
				setShowConfirm(false)
			}
		})
	}

	const stopNavigation = (event: MouseEvent) => {
		event.preventDefault()
		event.stopPropagation()
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
			className={cn(
				isCard
					? 'relative z-10 mt-3 pt-3 border-t border-border/40'
					: 'mt-6 pt-6 border-t border-border/60',
				className,
			)}
			onClick={stopNavigation}
		>
			<AnimatePresence mode="wait">
				{showConfirm ? (
					<motion.div
						key="confirm"
						{...fadeUp}
						className={cn(
							'rounded-xl border border-destructive/25 bg-destructive/8 backdrop-blur-sm',
							isCard ? 'p-3' : 'p-4',
						)}
					>
						<p className="mb-3 text-sm leading-snug text-destructive">
							Delete this {typeLabel}? This cannot be undone.
						</p>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
							<button
								type="button"
								onClick={() => setShowConfirm(false)}
								disabled={isPending}
								className={cn(
									actionButtonBase,
									'w-full sm:w-auto px-4 py-2.5 text-sm bg-muted text-foreground hover:bg-muted/70',
								)}
							>
								Cancel
							</button>
							<motion.button
								type="button"
								onClick={handleDelete}
								disabled={isPending}
								whileTap={{ scale: 0.96 }}
								transition={springSnappy}
								className={cn(
									actionButtonBase,
									'w-full sm:w-auto px-4 py-2.5 text-sm bg-destructive text-destructive-foreground shadow-sm shadow-destructive/20 hover:bg-destructive/90',
								)}
							>
								{isPending ? 'Deleting...' : 'Delete'}
							</motion.button>
						</div>
					</motion.div>
				) : (
					<motion.div
						key="actions"
						{...fadeUp}
						className={cn(
							isCard
								? 'grid grid-cols-2 gap-2 w-full'
								: 'flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 w-full',
						)}
					>
						{error && (
							<p
								className={cn(
									'text-destructive col-span-2',
									isCard ? 'text-xs mb-0.5' : 'text-sm w-full mb-1',
								)}
							>
								{error}
							</p>
						)}
						<Link
							href={`/editor/${postId}`}
							className={cn(
								actionButtonBase,
								'hover-gold-surface',
								isCard
									? 'w-full px-3 text-xs bg-foreground/[0.04] text-foreground/80 border border-border/60'
									: 'w-full sm:w-auto px-4 py-2.5 text-sm bg-foreground/[0.04] text-foreground border border-border/60',
							)}
						>
							<EditIcon className={isCard ? 'w-3.5 h-3.5 shrink-0' : 'w-4 h-4 shrink-0'} />
							<span className="truncate">
								Edit{!isCard && (category === 'blog' ? ' Blog' : ' Post')}
							</span>
						</Link>
						<motion.button
							type="button"
							onClick={() => setShowConfirm(true)}
							whileTap={{ scale: 0.96 }}
							transition={springSnappy}
							className={cn(
								actionButtonBase,
								'hover-gold-surface',
								isCard
									? 'w-full px-3 text-xs text-muted-foreground border border-border/60'
									: 'w-full sm:w-auto px-4 py-2.5 text-sm text-muted-foreground border border-border/60',
							)}
						>
							<TrashIcon className={isCard ? 'w-3.5 h-3.5 shrink-0' : 'w-4 h-4 shrink-0'} />
							<span className="truncate">
								Delete{!isCard && (category === 'blog' ? ' Blog' : ' Post')}
							</span>
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

function EditIcon({ className }: { className?: string }) {
	return (
		<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
			/>
		</svg>
	)
}

function TrashIcon({ className }: { className?: string }) {
	return (
		<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
			/>
		</svg>
	)
}

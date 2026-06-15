/**
 * Posts Feed Page
 * 
 * Displays a paginated list of published posts.
 * Server Component = Runs on the server, can fetch data directly.
 * 
 * This is the main UGC feed where users can browse all published content.
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { getPosts } from '@/lib/ugc'
import { PostCard, PostCardSkeleton } from '@/components/ugc'

// Metadata for SEO
export const metadata = {
  title: 'Posts | JT Dev Studio',
  description: 'Browse posts, discussions, and content from the community.',
}

/**
 * Posts Feed with Server-Side Data Fetching
 */
async function PostsFeed() {
  const { data: posts, hasMore, nextCursor } = await getPosts({ limit: 10 })

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
        <p className="text-muted-foreground mb-6">Be the first to share something!</p>
        <Link
          href="/editor/new"
          className="btn-gold inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Post
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Load More - Client-side pagination would go here */}
      {hasMore && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            More posts available. Scroll down or refresh to see more.
          </p>
          {/* Future: Add "Load More" button with client-side fetching */}
        </div>
      )}
    </>
  )
}

/**
 * Loading State - Shows skeleton cards while data loads
 */
function PostsFeedSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Main Page Component
 */
export default function PostsPage() {
  return (
    <main className="page-container py-3 sm:py-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl">Posts</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Discover posts, discussions, and content from the community.
          </p>
        </div>
        <Link
          href="/editor/new"
          className="touch-target-inline btn-gold inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium sm:w-auto sm:text-base"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Posts Feed with Suspense for Loading State */}
      <Suspense fallback={<PostsFeedSkeleton />}>
        <PostsFeed />
      </Suspense>
    </main>
  )
}

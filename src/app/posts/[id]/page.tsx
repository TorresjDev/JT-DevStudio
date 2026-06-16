/**
 * Post Detail Page
 * 
 * Displays a single post with its full content and comments.
 * Uses dynamic routing: /posts/[id] where [id] is the post UUID.
 * 
 * Dynamic Route = A route that changes based on a parameter
 * UUID = Universally Unique Identifier (the post's ID)
 */

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPost, getThreadedComments, getPostMedia, getMediaUrl } from '@/lib/ugc'
import { sanitizePostContent } from '@/lib/sanitizePostContent'
import { CommentsSection, PostReactions, PostOwnerActions, UserAvatar, formatDistanceToNow, formatDate } from '@/components/ugc'
import { createClient } from '@/utils/supabase/server'

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Validate if a string is a valid UUID format
 */
function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id)
}

/**
 * Get current user ID from session
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

// Generate metadata dynamically based on the post
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Validate UUID format first
  if (!isValidUUID(id)) {
    return { title: 'Post Not Found | JT Dev Studio' }
  }

  try {
    const post = await getPost(id)

    if (!post) {
      return { title: 'Post Not Found | JT Dev Studio' }
    }

    return {
      title: `${post.title} | JT Dev Studio`,
      description: post.content.substring(0, 160),
    }
  } catch {
    return { title: 'Post Not Found | JT Dev Studio' }
  }
}

/**
 * Post Content Component
 */
async function PostContent({ postId }: { postId: string }) {
  // Validate UUID format before making database queries
  if (!isValidUUID(postId)) {
    notFound()
  }

  const [post, comments, media, currentUserId] = await Promise.all([
    getPost(postId),
    getThreadedComments(postId),
    getPostMedia(postId),
    getCurrentUserId(),
  ]).catch(() => notFound())

  if (!post) {
    notFound()
  }

  // Get signed URLs for media
  const mediaWithUrls = await Promise.all(
    media.map(async (m) => ({
      ...m,
      url: await getMediaUrl(m.storage_path),
    }))
  ).catch(() => [])

  return (
    <article className="overflow-hidden rounded-xl border border-border/50 bg-card p-4 sm:p-6 md:p-8 lg:p-10">
        {/* Category + Status */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary capitalize">
            {post.category}
          </span>
          {post.status === 'draft' && (
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
              Draft
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="mb-4 text-2xl font-extrabold leading-tight tracking-tight break-words sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">{post.title}</h1>

        {/* Author + Metadata */}
        <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-border pb-6 sm:mb-8 sm:gap-4 sm:pb-8">
          {post.author && (
            <div className="flex items-center gap-3">
              <UserAvatar
                avatarUrl={post.author.avatar_url}
                displayName={post.author.display_name}
                username={post.author.username}
                size="md"
              />
              {/* Name + Date */}
              <div>
                <p className="font-medium">
                  {post.author.display_name || post.author.username || 'Anonymous'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.created_at)}
                  {post.updated_at !== post.created_at && (
                    <span> · Updated {formatDistanceToNow(post.updated_at)}</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Media Gallery */}
        {mediaWithUrls.length > 0 && (
          <div className={`mb-8 ${
            mediaWithUrls.length === 1 
              ? 'flex justify-center w-full' 
              : 'grid gap-6 grid-cols-1 md:grid-cols-2'
          }`}>
            {mediaWithUrls.map((m) => {
              if (!m.url) return null

              const isImage = m.mime_type.startsWith('image/')
              const isVideo = m.mime_type.startsWith('video/')
              const isAudio = m.mime_type.startsWith('audio/')
              const isPdf = m.mime_type === 'application/pdf'

              const singleClass = mediaWithUrls.length === 1 
                ? 'w-full max-w-4xl aspect-video rounded-xl shadow-lg border border-border/30 overflow-hidden relative'
                : 'relative aspect-video rounded-lg overflow-hidden bg-muted border border-border/50'

              if (isImage) {
                return (
                  <div key={m.id} className={singleClass}>
                    <Image
                      src={m.url}
                      alt={m.file_name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )
              }

              if (isVideo) {
                return (
                  <video
                    key={m.id}
                    src={m.url}
                    controls
                    className={`rounded-xl border border-border/50 ${
                      mediaWithUrls.length === 1 ? 'w-full max-w-4xl shadow-lg aspect-video' : 'w-full'
                    }`}
                  >
                    Your browser does not support the video tag.
                  </video>
                )
              }

              if (isAudio) {
                return (
                  <audio
                    key={m.id}
                    src={m.url}
                    controls
                    className={`w-full ${mediaWithUrls.length === 1 ? 'max-w-xl' : ''}`}
                  >
                    Your browser does not support the audio tag.
                  </audio>
                )
              }

              if (isPdf) {
                return (
                  <a
                    key={m.id}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors ${
                      mediaWithUrls.length === 1 ? 'w-full max-w-xl' : ''
                    }`}
                  >
                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm3 3c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z" />
                    </svg>
                    <div>
                      <p className="font-medium">{m.file_name}</p>
                      <p className="text-xs text-muted-foreground">PDF Document</p>
                    </div>
                  </a>
                )
              }

              return null
            })}
          </div>
        )}

        {/* Content - Render HTML from rich text editor */}
        <div
          className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-em:text-foreground/90 prose-li:text-foreground/90 prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-blockquote:border-primary prose-blockquote:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: sanitizePostContent(post.content) }}
        />

        {/* Reactions */}
        <PostReactions postId={postId} />

        {/* Owner actions: edit + delete */}
        <PostOwnerActions
          postId={postId}
          authorId={post.author_id}
          currentUserId={currentUserId}
          category={post.category}
        />

        {/* Comments Section */}
        <CommentsSection postId={postId} comments={comments} />
      </article>
    )
}

/**
 * Loading State
 */
function PostContentSkeleton() {
  return (
    <article className="bg-card rounded-xl border border-border/50 p-8 animate-pulse">
      <div className="h-6 w-20 rounded-full bg-muted mb-4" />
      <div className="h-10 w-3/4 rounded bg-muted mb-4" />
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
        <div className="w-12 h-12 rounded-full bg-muted" />
        <div>
          <div className="h-5 w-32 rounded bg-muted mb-2" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-4/5 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
      </div>
    </article>
  )
}

/**
 * Main Page Component
 */
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <main className="page-container w-full py-3 sm:py-4">
      {/* Back Link */}
      <Link
        href="/posts"
        className="touch-target-inline ui-press mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:mb-6 sm:text-base"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Posts
      </Link>

      <Suspense fallback={<PostContentSkeleton />}>
        <PostContent postId={id} />
      </Suspense>
    </main>
  )
}

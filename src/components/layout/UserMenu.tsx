'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { signout } from '@/app/login/actions'
import {
	LogOut,
	LogIn,
	User as UserIcon,
	ChevronDown,
	Github,
	Settings,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { springSnappy, staggerContainer, staggerItem } from '@/lib/motion'

const supabase = createClient()

const menuItems = [
	{ href: '/profile', icon: UserIcon, label: 'Profile' },
	{ href: '/settings', icon: Settings, label: 'Settings' },
] as const

export default function UserMenu({
	showName = true,
	dropdownPlacement = 'top',
	dropdownAlign = 'right',
}: {
	showName?: boolean
	dropdownPlacement?: 'top' | 'bottom'
	dropdownAlign?: 'left' | 'right'
}) {
	const { user, loading, hasMounted } = useAuth()
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!isOpen) return

		const handlePointerDown = (event: MouseEvent | TouchEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsOpen(false)
		}

		document.addEventListener('mousedown', handlePointerDown)
		document.addEventListener('touchstart', handlePointerDown)
		document.addEventListener('keydown', handleEscape)
		return () => {
			document.removeEventListener('mousedown', handlePointerDown)
			document.removeEventListener('touchstart', handlePointerDown)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen])

	const handleSignOut = async () => {
		setIsOpen(false)
		await supabase.auth.signOut()
		await signout()
	}

	if (!hasMounted || loading) {
		return (
			<div className="flex items-center gap-2 p-1">
				<div className="h-8 w-8 animate-pulse rounded-full bg-white/5" />
				{showName && <div className="h-4 w-20 animate-pulse rounded bg-white/5" />}
			</div>
		)
	}

	if (!user) {
		return (
			<Link
				href="/login"
				aria-label="Login"
				className="ui-press group flex items-center gap-2 rounded-lg p-2 text-sm font-medium text-[#DAA520] transition-colors hover:bg-sidebar-accent hover:text-[#DAA520]/90 group-data-[collapsible=icon]:justify-center"
			>
				<LogIn className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
				<span className="group-data-[collapsible=icon]:hidden">Login</span>
			</Link>
		)
	}

	const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
	const displayName =
		user.user_metadata?.full_name ||
		user.user_metadata?.name ||
		user.email?.split('@')[0] ||
		'User'
	const isGithub = user.app_metadata?.provider === 'github'
	const initials = displayName.slice(0, 2).toUpperCase()

	return (
		<div ref={containerRef} className="relative">
			<motion.button
				type="button"
				onClick={() => setIsOpen((open) => !open)}
				whileTap={{ scale: 0.97 }}
				transition={springSnappy}
				aria-expanded={isOpen}
				aria-haspopup="menu"
				className={cn(
					'ui-press group flex items-center gap-2 rounded-full p-1 transition-colors',
					isOpen ? 'bg-white/8 ring-1 ring-[#DAA520]/25' : 'hover:bg-white/5',
				)}
			>
				<div className="relative">
					{avatarUrl ? (
						<Image
							src={avatarUrl}
							alt="User"
							width={32}
							height={32}
							className="rounded-full border border-[#DAA520]/20 object-cover transition-transform duration-200 group-hover:scale-[1.03]"
						/>
					) : (
						<div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DAA520]/30 bg-linear-to-br from-[#DAA520]/30 to-[#DAA520]/10">
							<span className="text-xs font-bold text-[#DAA520]">{initials}</span>
						</div>
					)}
					{isGithub && (
						<div className="absolute -bottom-1 -right-1 rounded-full border border-white/20 bg-[#24292e] p-0.5">
							<Github className="h-2.5 w-2.5 text-white" />
						</div>
					)}
				</div>

				{showName && (
					<div className="hidden flex-col items-start text-left md:flex">
						<span className="text-xs font-bold leading-none text-white/90">{displayName}</span>
						<span className="mt-1 text-[10px] leading-none text-white/40">Logged in</span>
					</div>
				)}
				<ChevronDown
					className={cn(
						'h-4 w-4 text-white/40 transition-transform duration-300 ease-out',
						isOpen && 'rotate-180 text-[#DAA520]/70',
					)}
				/>
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.15 }}
							className="fixed inset-0 z-90 bg-black/20 backdrop-blur-[1px] md:hidden"
							onClick={() => setIsOpen(false)}
						/>
						<motion.div
							role="menu"
							initial={{ opacity: 0, y: 16, scale: 0.98 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 12, scale: 0.98 }}
							transition={springSnappy}
							className={cn(
								'z-100 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl',
								'max-sm:fixed max-sm:inset-x-3 max-sm:bottom-[max(0.75rem,env(safe-area-inset-bottom))] max-sm:top-auto max-sm:w-auto',
								'sm:absolute sm:w-56 sm:max-w-[calc(100vw-2rem)]',
								dropdownPlacement === 'top' ? 'sm:bottom-full sm:mb-2' : 'sm:top-full sm:mt-2',
								dropdownAlign === 'right' ? 'sm:right-0' : 'sm:left-0',
							)}
						>
							<div className="mb-2 border-b border-white/5 px-3 py-2">
								<p className="mb-1 text-xs font-medium text-white/40">Signed in as</p>
								<p className="truncate text-sm font-bold text-white">{user.email}</p>
							</div>

							<motion.div variants={staggerContainer} initial="initial" animate="animate">
								{menuItems.map(({ href, icon: Icon, label }) => (
									<motion.div key={href} variants={staggerItem}>
										<Link
											href={href}
											role="menuitem"
											onClick={() => setIsOpen(false)}
											className="touch-target-inline ui-press group flex items-center gap-3 rounded-xl px-3 py-3 text-white/70 transition-colors hover:bg-white/6 hover:text-[#DAA520] sm:py-2.5"
										>
											<Icon className="h-4 w-4 transition-colors duration-200 group-hover:text-[#DAA520]" />
											<span className="text-sm font-medium">{label}</span>
										</Link>
									</motion.div>
								))}

								<motion.div variants={staggerItem}>
									<button
										type="button"
										role="menuitem"
										onClick={handleSignOut}
										className="touch-target-inline ui-press mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-400/70 transition-colors hover:bg-red-400/8 hover:text-red-400 sm:py-2.5"
									>
										<LogOut className="h-4 w-4" />
										<span className="text-sm font-medium">Log Out</span>
									</button>
								</motion.div>
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	)
}

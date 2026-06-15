import Image from "next/image"
import { isAllowedImageUrl } from "@/lib/allowedImageHosts"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
	avatarUrl: string | null | undefined
	displayName?: string | null
	username?: string | null
	size?: "sm" | "md"
	className?: string
}

const sizeClasses = {
	sm: "w-8 h-8 text-sm",
	md: "w-12 h-12 text-lg",
} as const

export function UserAvatar({
	avatarUrl,
	displayName,
	username,
	size = "sm",
	className,
}: UserAvatarProps) {
	const label = displayName || username || "User"
	const initial = (displayName || username || "U")[0].toUpperCase()
	const showImage = isAllowedImageUrl(avatarUrl)

	return (
		<div
			className={cn(
				"relative rounded-full overflow-hidden bg-muted shrink-0",
				sizeClasses[size],
				className,
			)}
		>
			{showImage && avatarUrl ? (
				<Image src={avatarUrl} alt={label} fill className="object-cover" />
			) : (
				<div className="w-full h-full flex items-center justify-center text-muted-foreground font-medium">
					{initial}
				</div>
			)}
		</div>
	)
}

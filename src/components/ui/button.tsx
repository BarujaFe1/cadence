import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "soft";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-canvas hover:opacity-90 shadow-[0_10px_30px_rgba(28,27,26,0.12)] dark:bg-accent dark:text-[#0e0f10]",
  secondary:
    "bg-canvas-elevated text-ink border border-line hover:bg-white/80 dark:hover:bg-white/5",
  ghost: "bg-transparent text-ink-soft hover:bg-black/5 dark:hover:bg-white/5",
  soft: "bg-accent-soft text-accent hover:opacity-90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm rounded-full",
  md: "h-11 px-5 text-sm rounded-full",
  lg: "h-12 px-6 text-[15px] rounded-full",
  icon: "h-11 w-11 rounded-full inline-flex items-center justify-center",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

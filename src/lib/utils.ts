// Minimal `cn` — joins truthy class names.
// The shadcn version wraps clsx + tailwind-merge; this project has no Tailwind,
// so there are no utility conflicts to merge and a plain join is equivalent.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

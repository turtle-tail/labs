interface TagProps {
  children: string
}

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-block px-4 py-1.5 text-sm text-primary border border-primary rounded-full">
      {children}
    </span>
  )
}

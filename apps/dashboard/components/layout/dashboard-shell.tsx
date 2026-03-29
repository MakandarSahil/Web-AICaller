export function DashboardShell({ children }: { children: React.ReactNode, profile: any, workspace: any }) {
  return (
    <div className="flex h-screen w-full bg-background mt-16 p-6">
      <main className="flex-1 w-full mx-auto max-w-7xl">
        {children}
      </main>
    </div>
  )
}

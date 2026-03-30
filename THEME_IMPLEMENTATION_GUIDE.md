# Theme Implementation Guide for Web-AIcaller

## Overview

This guide ensures consistent dark mode theme application across the dashboard following Turbo monorepo best practices.

## Architecture

### CSS Variables Foundation (`apps/dashboard/app/globals.css`)

All colors are defined as CSS variables using HSL format for easy theme switching:

```css
:root {
  /* Light mode */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.1%;
  --card: 0 0% 100%;
  /* ... more variables */
}

.dark {
  /* Dark mode */
  --background: 227 21% 12%;
  --foreground: 210 40% 98%;
  --card: 231 14% 17%;
  /* ... more variables */
}
```

### Semantic Color Mapping

The Tailwind config (`packages/config/tailwind.config.ts`) maps semantic names to CSS variables:

```typescript
// Before: Hardcoded colors (❌ Does NOT respond to theme)
colors: {
  background: { DEFAULT: '#ffffff' },
  content: { DEFAULT: '#1e1e1e', secondary: '#4b5563' }
}

// After: CSS variable-based (✅ Responds to .dark class)
colors: {
  background: 'hsl(var(--background) / <alpha-value>)',
  foreground: 'hsl(var(--foreground) / <alpha-value>)',
}
```

## Implementation Standards

### ✅ DO: Use Semantic Color Classes

```tsx
// ✅ Correct - Uses CSS variables, responds to theme
export function Button() {
  return <button className="bg-primary text-primary-foreground hover:bg-primary/90" />
}

// ✅ Correct - Add dark mode variants for clarity
export function Card() {
  return <div className="bg-card text-foreground dark:bg-card dark:text-foreground" />
}
```

### ❌ DON'T: Use Hardcoded Colors

```tsx
// ❌ Wrong - Hardcoded colors, ignores dark mode
<button className="bg-white text-gray-700 hover:bg-gray-100" />

// ❌ Wrong - Light mode only colors
<div className="bg-white/10 text-gray-600" />
```

## Shared UI Components

All components in `packages/ui/src/components/ui/` are using semantic colors and support dark mode:

- ✅ **Button** - All variants have dark mode styles
- ✅ **Card** - Uses glass class + semantic colors
- ✅ **Input** - CSS variables with dark variants
- ✅ **Label** - Foreground text color
- ✅ **Badge** - Primary, secondary, destructive variants
- ✅ **Dropdown** - Full dark mode support
- ✅ **Dialog** - Overlay + content dark styles
- ✅ **Select** - Input-based styling
- ✅ **Table** - Border and hover states
- ✅ **Tabs** - Active/inactive tab states
- ✅ **Switch** - Toggle states
- ✅ **Tooltip** - Glass style with dark support

## Dashboard Setup

### Root Layout (`apps/dashboard/app/layout.tsx`)

Ensures proper theme provider setup:

```tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      {/* suppressHydrationWarning prevents hydration mismatch */}
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Theme Provider (`apps/dashboard/providers/theme-provider.tsx`)

Uses next-themes for class-based dark mode:

```tsx
<NextThemesProvider 
  attribute="class"           // Toggles .dark class
  defaultTheme="system"       // Respects OS preference
  enableSystem               // Auto-detect system theme
  disableTransitionOnChange  // Smooth theme switching
/>
```

### DashboardShell (`apps/dashboard/components/layout/dashboard-shell.tsx`)

Applies CSS variables to wrapper:

```tsx
<div 
  className="flex h-screen w-full"
  style={{ 
    backgroundColor: 'hsl(var(--background))',
    color: 'hsl(var(--foreground))'
  }}
>
```

## Page Implementation

### Consistent Page Structure

All pages should follow this pattern:

```tsx
// pages/agents/page.tsx
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, Badge } from '@aicaller/ui'

export default function AgentsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Agents</h1>
        
        <Card className="bg-card border-border">
          <div className="p-6">
            <p className="text-muted-foreground">Agent description</p>
            <Badge variant="default">Active</Badge>
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}
```

### Layout-Specific Styling

Each layout can define page-specific styles using semantic colors:

```tsx
// layouts/DashboardLayout.tsx
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground">
      {/* Uses CSS variables from globals.css */}
      {children}
    </div>
  )
}
```

## Turbo Monorepo Best Practices

### 1. Centralized Configuration

- **Tailwind Config**: `packages/config/tailwind.config.ts` - Single source of truth
- **CSS Variables**: `apps/dashboard/app/globals.css` - Theme definitions
- **Theme Provider**: `apps/dashboard/providers/theme-provider.tsx` - Theme logic

### 2. Workspace Consistency

Each app/package inherits from shared config:

```json
// apps/dashboard/tailwind.config.ts
{
  "presets": ["@aicaller/config/tailwind"],
  "content": ["./app/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"]
}
```

### 3. Dependency Management

```
packages/ui (shared components)
    ↓
apps/dashboard (uses shared components)
apps/web (uses shared components)
```

All components use CSS variables defined in root app.

## Color Palette Reference

### Semantic Colors

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--background` | White | Dark Gray | Main page background |
| `--foreground` | Black | White | Primary text |
| `--card` | White | Slate | Card backgrounds |
| `--primary` | Blue 500 | Blue 400 | Buttons, links |
| `--muted` | Gray 100 | Gray 800 | Disabled, secondary text |
| `--border` | Gray 200 | Gray 700 | Dividers, borders |
| `--destructive` | Red 600 | Red 500 | Danger buttons, alerts |

### Hex Values (for reference)

**Light Mode:**
- Background: `#ffffff`
- Card: `#ffffff`
- Foreground: `#1e1e1e`
- Border: `#e8eaef`

**Dark Mode:**
- Background: `#181b25`
- Card: `#242630`
- Foreground: `#f0f4f8`
- Sidebar: `#0e121b`
- Border: `#1a1f2e`

## Testing Dark Mode

### Manual Testing

1. Open dashboard: `http://localhost:3001`
2. Open DevTools Console and run:

```javascript
// Toggle dark mode
document.documentElement.classList.toggle('dark')
```

3. Verify all pages render correctly:
   - `/dashboard` - Overview
   - `/dashboard/agents` - Agents page
   - `/dashboard/conversations` - Conversations
   - `/dashboard/knowledge-bases` - Knowledge bases
   - `/dashboard/phone-numbers` - Phone numbers
   - `/dashboard/api-keys` - API keys
   - `/dashboard/settings` - Settings

### Affected Elements to Check

- [ ] Buttons hover states
- [ ] Card backgrounds
- [ ] Text contrast
- [ ] Input fields focus states
- [ ] Dropdown menus
- [ ] Modal overlays
- [ ] Navigation sidebars
- [ ] Table rows
- [ ] Badge colors
- [ ] Icon colors

## Troubleshooting

### Theme Not Applying

**Problem:** Dark mode styles not appearing

**Solution:** Check `suppressHydrationWarning` in root `<html>`:
```tsx
<html suppressHydrationWarning>
```

### Hardcoded Colors Still Present

**Problem:** Some colors aren't changing

**Check:**
1. Component using hardcoded hex/rgb colors?
2. Inline styles overriding classes?
3. Class not in Tailwind config?

**Fix:** Replace with semantic class from this guide.

### Inconsistent Colors Between Pages

**Problem:** Different pages have different colors

**Ensure:**
1. All pages import from `@aicaller/ui`
2. Root layout has ThemeProvider wrapping app
3. `global.css` is imported in root layout

## Future Improvements

- [ ] Create Storybook theme stories
- [ ] Add WebA11y contrast checking in CI
- [ ] Implement theme user preference storage
- [ ] Add theme toggling component
- [ ] Create Figma design system tokens

## References

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

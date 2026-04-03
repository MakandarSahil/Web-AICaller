// ── Utilities ─────────────────────────────────────────────────────────────────
export { cn } from './lib'

// ── Components ────────────────────────────────────────────────────────────────
// These are manually maintained shadcn components themed for CallMind.
// To add a new component: create the file in src/components/ui/ and export here.

export { Button, buttonVariants } from './components/ui/button'
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/ui/card'
export { Badge, badgeVariants } from './components/ui/badge'
export { Input } from './components/ui/input'
export { Label } from './components/ui/label'
export { Separator } from './components/ui/separator'
export { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar'
export { Alert, AlertTitle, AlertDescription } from './components/ui/alert'
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/ui/dialog'
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './components/ui/dropdown-menu'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './components/ui/tooltip'
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './components/ui/sheet'
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './components/ui/table'
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './components/ui/select'
export { Switch } from './components/ui/switch'
export { Textarea } from './components/ui/textarea'
export { Skeleton } from './components/ui/skeleton'
export { ScrollArea, ScrollBar } from './components/ui/scroll-area'
export { Progress } from './components/ui/progress'
export { DottedNumber } from './components/marketing/dotted-number'
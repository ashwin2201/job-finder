export const appTheme = {
  shell: "bg-background shadow-[0_28px_90px_rgba(15,23,42,0.08)]",
  rail: "border-r border-sidebar-border bg-sidebar",
  sidebar: "border-sidebar-border bg-secondary/50",
  panel: "border bg-card shadow-[0_14px_34px_rgba(15,23,42,0.04)]",
  selectedPanel:
    "border border-primary/25 bg-card shadow-[0_18px_40px_rgba(15,23,42,0.08)]",
  accent: "text-primary",
  accentBg: "bg-primary",
  accentSoft: "bg-accent text-primary",
  muted: "text-muted-foreground",
  title: "text-foreground",
  search: "border-input bg-background",
  button:
    "bg-primary text-primary-foreground shadow-[0_18px_36px_rgba(15,23,42,0.14)] hover:bg-primary/90",
} as const

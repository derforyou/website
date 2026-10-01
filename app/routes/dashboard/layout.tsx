import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import {
  ContactRound,
  Globe2,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings2,
} from "lucide-react";
import { Link, Outlet, redirect, useLocation, useNavigate } from "react-router";

export async function clientLoader() {
  const session = await authClient.getSession();
  if (!session.data) throw redirect("/auth/signin");
  return { user: session.data.user };
}

const primaryNavigation = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Domains", url: "/dashboard/domains", icon: Globe2 },
];

const accountNavigation = [
  { title: "API keys", url: "/dashboard/settings/api-keys", icon: KeyRound },
  { title: "Contact profile", url: "/dashboard/settings/contact", icon: ContactRound },
  { title: "Settings", url: "/dashboard/settings", icon: Settings2 },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/domains": "Domains",
  "/dashboard/domains/register": "Register domain",
  "/dashboard/settings": "Settings",
  "/dashboard/settings/account": "Account",
  "/dashboard/settings/contact": "Contact profile",
  "/dashboard/settings/api-keys": "API keys",
};

function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="DER workspace">
              <Link to="/dashboard">
                <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                  D
                </span>
                <span className="flex min-w-0 flex-col text-left leading-tight">
                  <span className="truncate font-semibold">DER</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Domain workspace
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavigation.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Developer</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavigation.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Register a domain">
              <Link to="/dashboard/domains/register">
                <Plus />
                <span>Register domain</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default function MainLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pageTitle = pageTitles[pathname] ?? "Workspace";
  const sectionTitle = pathname.startsWith("/dashboard/settings")
    ? "Developer"
    : pathname.startsWith("/dashboard/domains")
      ? "Workspace"
      : null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <Breadcrumb>
              <BreadcrumbList>
                {sectionTitle && (
                  <>
                    <BreadcrumbItem className="hidden sm:inline-flex">
                      <BreadcrumbLink asChild>
                        <Link to={sectionTitle === "Developer" ? "/dashboard/settings" : "/dashboard/domains"}>
                          {sectionTitle}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden sm:block" />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {pathname !== "/dashboard/domains/register" && (
              <Button asChild size="sm">
                <Link to="/dashboard/domains/register">
                  <Plus data-icon="inline-start" />
                  <span className="hidden sm:inline">Register domain</span>
                  <span className="sm:hidden">Register</span>
                </Link>
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              title="Sign out"
              onClick={async () => {
                await authClient.signOut();
                navigate("/auth/signin");
              }}
            >
              <LogOut />
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client"

import * as React from "react"
import {
  Command,
  Files,
  SquareTerminal,
  Upload,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

const data = {
  user: {
    name: "kverse",
    email: "kverse@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Upload Files",
      url: "upload-files",
      icon: SquareTerminal,
      isActive: true,
      items: [
      ],
    },
    {
      title: "Unlabelled",
      url: "annotations/unlabelled",
      icon: SquareTerminal,
      isActive: true
    },
    {
      title: "Labelled",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Chapter",
          url: "annotations/unlabelled",
        },
        {
          title: "Index",
          url: "annotations/labelled",
        }
      ],
    },
    {
      title: "Markdown Viewer",
      url: "/markdown-viewer",
      icon: SquareTerminal,
      isActive: true,
      items: [
      ],
    },
    {
      title: "Image Annotations",
      url: "/image-annotations",
      icon: SquareTerminal,
      isActive: true,
      items: [
      ],
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Support",
  //     url: "#",
  //     icon: LifeBuoy,
  //   },
  //   {
  //     title: "Feedback",
  //     url: "#",
  //     icon: Send,
  //   },
  // ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const navMain = [
    {
      title: "Upload File",
      url: "/dashboard",
      icon: Upload,
    },
    {
      title: "View Uploads",
      url: "/uploads",
      icon: Files,
    }
  ];
  
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Kverse</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

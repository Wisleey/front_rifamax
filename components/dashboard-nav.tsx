"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, PlusCircle, ShoppingBag, Ticket, LogOut } from "lucide-react"

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  isCreator?: boolean
}

export function DashboardNav({ className, isCreator = true, ...props }: NavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Minhas Compras",
      href: "/dashboard/my-purchases",
      icon: ShoppingBag,
    },
    ...(isCreator
      ? [
          {
            title: "Minhas Rifas",
            href: "/dashboard/my-raffles",
            icon: Ticket,
          },
          {
            title: "Criar Nova Rifa",
            href: "/dashboard/create-raffle",
            icon: PlusCircle,
          },
        ]
      : []),
  ]

  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props}>
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "justify-start",
            pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="justify-start text-red-500 hover:bg-transparent hover:text-red-700 hover:underline mt-auto"
        asChild
      >
        <Link href="/login">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Link>
      </Button>
    </nav>
  )
}

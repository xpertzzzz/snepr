import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Search,
  Sparkles,
  Users,
  Building2,
  Clock,
  ShieldCheck,
  CreditCard,
  Settings,
  HelpCircle,
  Home,
  Scissors,
  LogOut,
  Armchair,
  Award,
} from "lucide-react";
import { REAL_SALONS_DATA } from "@/lib/real-salons";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Read current user session
  const [userRole, setUserRole] = useState<"customer" | "owner" | "staff" | "admin">("customer");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snepr_session");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role) setUserRole(u.role);
      }
    } catch {}
  }, [open]);

  // Global keyboard listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search salons (e.g. queue, studio, haircut)..." />
      <CommandList className="max-h-[380px] overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>

        {/* 1. Quick Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => handleSelect(() => navigate({ to: "/" }))}
            className="cursor-pointer"
          >
            <Home className="mr-2 h-4 w-4 text-[#7A4B29]" />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect(() => navigate({ to: "/salons" }))}
            className="cursor-pointer"
          >
            <Search className="mr-2 h-4 w-4 text-[#7A4B29]" />
            <span>Find Salons & Check Live Wait</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect(() => navigate({ to: "/pricing" }))}
            className="cursor-pointer"
          >
            <CreditCard className="mr-2 h-4 w-4 text-[#7A4B29]" />
            <span>Salon Subscription Plans (₹199, ₹400, ₹449)</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect(() => navigate({ to: "/how-it-works" }))}
            className="cursor-pointer"
          >
            <HelpCircle className="mr-2 h-4 w-4 text-[#7A4B29]" />
            <span>How Snepr Works</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* 2. Customer Actions */}
        <CommandGroup heading="Customer Queue & Studio">
          <CommandItem
            onSelect={() => handleSelect(() => navigate({ to: "/dashboard" }))}
            className="cursor-pointer"
          >
            <Clock className="mr-2 h-4 w-4 text-[#7A4B29]" />
            <span>My Active Token & Queue Dashboard</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect(() => navigate({ to: "/live/studio" }))}
            className="cursor-pointer"
          >
            <Sparkles className="mr-2 h-4 w-4 text-[#7A4B29]" />
            <span>Snepr AI Studio (Virtual Haircut & Beard Preview)</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect(() => navigate({ to: "/points" }))}
            className="cursor-pointer"
          >
            <Award className="mr-2 h-4 w-4 text-[#7A4B29]" />
            <span>Snepr Loyalty Points & Rewards</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* 3. Salon Owner Actions (Role-aware) */}
        {(userRole === "owner" || userRole === "admin" || userRole === "staff") && (
          <CommandGroup heading="Salon Operations (SalonOS)">
            <CommandItem
              onSelect={() => handleSelect(() => navigate({ to: "/salon-os" }))}
              className="cursor-pointer"
            >
              <Armchair className="mr-2 h-4 w-4 text-[#7A4B29]" />
              <span>Live Salon Queue Desk & Call Next</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelect(() => navigate({ to: "/salon-os" }))}
              className="cursor-pointer"
            >
              <Users className="mr-2 h-4 w-4 text-[#7A4B29]" />
              <span>Staff Management & Chair Availability</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelect(() => navigate({ to: "/salon-os" }))}
              className="cursor-pointer"
            >
              <Scissors className="mr-2 h-4 w-4 text-[#7A4B29]" />
              <span>Services & Pricing Configuration</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelect(() => navigate({ to: "/salon-os" }))}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4 text-[#7A4B29]" />
              <span>Salon Profile & QR Code Management</span>
            </CommandItem>
          </CommandGroup>
        )}

        {/* 4. Admin Actions (Admin only) */}
        {userRole === "admin" && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Snepr Admin Console">
              <CommandItem
                onSelect={() => handleSelect(() => navigate({ to: "/ankom" }))}
                className="cursor-pointer"
              >
                <ShieldCheck className="mr-2 h-4 w-4 text-[#7A4B29]" />
                <span>Admin Console: Overview & MRR</span>
              </CommandItem>
              <CommandItem
                onSelect={() => handleSelect(() => navigate({ to: "/ankom" }))}
                className="cursor-pointer"
              >
                <Building2 className="mr-2 h-4 w-4 text-[#7A4B29]" />
                <span>Partner Applications & Salon Verification</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        {/* 5. Direct Salons Search */}
        <CommandGroup heading="Popular Salons in Bhubaneswar">
          {REAL_SALONS_DATA.slice(0, 6).map((salon) => (
            <CommandItem
              key={salon.id}
              onSelect={() =>
                handleSelect(() =>
                  navigate({
                    to: "/live/salon/$id",
                    params: { id: salon.id },
                  })
                )
              }
              className="cursor-pointer"
            >
              <Building2 className="mr-2 h-4 w-4 text-[#786D65]" />
              <div className="flex flex-col">
                <span className="font-medium text-[#1F1C18]">{salon.name}</span>
                <span className="text-xs text-[#786D65]">
                  {salon.area} • Wait: {salon.waitTime} mins ({salon.waitingCount} in queue)
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}


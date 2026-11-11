import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SalonCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EFEAE2] shadow-sm flex flex-col justify-between h-[360px] animate-pulse">
      <div>
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-6 w-32 rounded-lg bg-[#EAE2D7]" />
          <Skeleton className="h-6 w-20 rounded-full bg-[#EAE2D7]" />
        </div>
        <Skeleton className="h-4 w-48 rounded bg-[#EAE2D7] mb-4" />
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-5 w-16 rounded-full bg-[#EAE2D7]" />
          <Skeleton className="h-5 w-20 rounded-full bg-[#EAE2D7]" />
        </div>
      </div>
      <div className="pt-4 border-t border-[#F2ECE3]">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-4 w-24 rounded bg-[#EAE2D7]" />
          <Skeleton className="h-5 w-12 rounded bg-[#EAE2D7]" />
        </div>
        <Skeleton className="h-11 w-full rounded-full bg-[#EAE2D7]" />
      </div>
    </div>
  );
}

export function SalonDiscoverySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SalonCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function QueueCardSkeleton() {
  return (
    <div className="bg-[#FAF7F2] border border-[#E8E1D7] rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-28 rounded-lg bg-[#E3DACD]" />
        <Skeleton className="h-6 w-16 rounded-full bg-[#E3DACD]" />
      </div>
      <Skeleton className="h-16 w-32 mx-auto rounded-2xl bg-[#E3DACD]" />
      <div className="grid grid-cols-3 gap-2 pt-2">
        <Skeleton className="h-12 rounded-xl bg-[#E3DACD]" />
        <Skeleton className="h-12 rounded-xl bg-[#E3DACD]" />
        <Skeleton className="h-12 rounded-xl bg-[#E3DACD]" />
      </div>
      <Skeleton className="h-12 w-full rounded-full bg-[#E3DACD]" />
    </div>
  );
}

export function CustomerTrackingSkeleton() {
  return (
    <div className="max-w-md mx-auto w-full p-4 space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-48 mx-auto rounded-lg bg-[#E3DACD]" />
        <Skeleton className="h-4 w-64 mx-auto rounded bg-[#E3DACD]" />
      </div>
      <QueueCardSkeleton />
      <div className="bg-white rounded-2xl p-4 border border-[#E8E1D7] space-y-3">
        <Skeleton className="h-5 w-32 rounded bg-[#E3DACD]" />
        <Skeleton className="h-10 w-full rounded-xl bg-[#E3DACD]" />
        <Skeleton className="h-10 w-full rounded-xl bg-[#E3DACD]" />
      </div>
    </div>
  );
}

export function SalonOwnerDashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-56 rounded-lg bg-[#E3DACD] mb-2" />
          <Skeleton className="h-4 w-40 rounded bg-[#E3DACD]" />
        </div>
        <Skeleton className="h-10 w-36 rounded-full bg-[#E3DACD]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#EEE7DC] space-y-2">
            <Skeleton className="h-4 w-24 rounded bg-[#E3DACD]" />
            <Skeleton className="h-7 w-16 rounded bg-[#E3DACD]" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-3xl p-6 border border-[#EEE7DC] space-y-4">
        <Skeleton className="h-6 w-36 rounded bg-[#E3DACD]" />
        <DataTableSkeleton rows={4} cols={5} />
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-64 rounded-xl bg-[#E3DACD]" />
        <Skeleton className="h-10 w-32 rounded-full bg-[#E3DACD]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#EEE7DC] space-y-2">
            <Skeleton className="h-4 w-28 rounded bg-[#E3DACD]" />
            <Skeleton className="h-8 w-20 rounded bg-[#E3DACD]" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-5 border border-[#EEE7DC]">
        <DataTableSkeleton rows={6} cols={6} />
      </div>
    </div>
  );
}

export function DataTableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-4 border-b border-[#EFEAE2] pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-5 flex-1 rounded bg-[#EAE2D7]" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-3 border-b border-[#FAF6F0] items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1 rounded bg-[#F0EAE2]" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PricingTableSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto py-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-8 border border-[#EEE7DC] space-y-6">
          <Skeleton className="h-6 w-24 rounded-full bg-[#EAE2D7]" />
          <Skeleton className="h-10 w-36 rounded-lg bg-[#EAE2D7]" />
          <Skeleton className="h-4 w-full rounded bg-[#EAE2D7]" />
          <div className="space-y-3 pt-4 border-t border-[#F0EAE2]">
            {Array.from({ length: 5 }).map((_, f) => (
              <Skeleton key={f} className="h-4 w-full rounded bg-[#EAE2D7]" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-full bg-[#EAE2D7]" />
        </div>
      ))}
    </div>
  );
}


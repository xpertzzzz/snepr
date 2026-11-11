import React from "react";
import { Filter, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  currentValue: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  groups: FilterGroup[];
  onResetAll?: () => void;
  activeCount?: number;
  className?: string;
}

export function FilterBar({
  groups,
  onResetAll,
  activeCount = 0,
  className = "",
}: FilterBarProps) {
  const activeFilters = groups.filter((g) => g.currentValue !== "all" && g.currentValue !== "");

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Filter Select Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#786D65] mr-1">
          <Filter className="w-3.5 h-3.5 text-[#7A4B29]" />
          <span>Filters:</span>
        </div>

        {groups.map((group) => (
          <div key={group.id} className="relative">
            <select
              value={group.currentValue}
              onChange={(e) => group.onChange(e.target.value)}
              className="appearance-none bg-white border border-[#D5CABB] rounded-full px-3.5 py-1.5 pr-8 text-xs font-medium text-[#2C241E] outline-none focus:border-[#7A4B29] transition-colors cursor-pointer hover:bg-[#FAF7F2]"
            >
              <option value="all">All {group.label}</option>
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8C7D70]">
              ▼
            </span>
          </div>
        ))}

        {activeFilters.length > 0 && onResetAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetAll}
            className="text-xs text-[#7A4B29] hover:bg-[#F5EFE6] rounded-full px-3 h-8 inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-[#8C7D70] font-medium mr-1">Active:</span>
          {activeFilters.map((group) => {
            const opt = group.options.find((o) => o.value === group.currentValue);
            return (
              <span
                key={group.id}
                className="inline-flex items-center gap-1 bg-[#F5EFE6] text-[#4A3C32] border border-[#DDD3C5] px-2.5 py-0.5 rounded-full text-[11px] font-medium"
              >
                <span className="text-[#8C7D70]">{group.label}:</span>
                <span className="font-semibold">{opt?.label || group.currentValue}</span>
                <button
                  type="button"
                  onClick={() => group.onChange("all")}
                  className="hover:text-rose-600 transition-colors ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}


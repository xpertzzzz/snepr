import React, { useState } from "react";
import { X, MapPin, Search, Check, Sparkles } from "lucide-react";
import { BHUBANESWAR_AREAS, Area, LocationState } from "@/types/location";

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation?: LocationState;
  selectedAreaId?: number;
  onSelectArea?: (area: Area) => void;
  // Backwards compatibility
  onSelectManual?: (label: string, lat?: number, lng?: number) => void;
  onUseGps?: () => void;
  isLocating?: boolean;
}

export function LocationSelectorModal({
  isOpen,
  onClose,
  currentLocation,
  selectedAreaId,
  onSelectArea,
  onSelectManual,
}: LocationSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const activeId = selectedAreaId || currentLocation?.areaId || 1;

  const filteredAreas = BHUBANESWAR_AREAS.filter((area) =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (area: Area) => {
    if (onSelectArea) {
      onSelectArea(area);
    }
    if (onSelectManual) {
      onSelectManual(`${area.name}, Bhubaneswar`, 0, 0);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B1410]/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-[#E8E1D7] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E8E1D7] bg-white/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7A4B29]/10 text-[#7A4B29] text-[11px] font-bold tracking-wide uppercase mb-1">
              <Sparkles className="w-3 h-3 text-[#C8993E]" />
              Launch City: Bhubaneswar
            </div>
            <h2 className="text-xl font-black text-[#1B1410] tracking-tight">Choose Your Locality</h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Select your neighborhood to see live chair availability and wait times.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#9C9086] hover:text-[#1B1410] transition rounded-full hover:bg-black/5"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9086]" />
            <input
              type="text"
              placeholder="Search Bhubaneswar localities (e.g. Patia, KIIT Road)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-[#E8E1D7] text-sm text-[#1B1410] placeholder-[#9C9086] focus:outline-none focus:ring-2 focus:ring-[#7A4B29]"
              autoFocus
            />
          </div>

          {/* Locality Grid / List */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A4B29] mb-2 px-1">
              Bhubaneswar Neighborhoods ({filteredAreas.length})
            </div>
            <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {filteredAreas.map((area) => {
                const isSelected = activeId === area.id;
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => handleSelect(area)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-[#7A4B29] text-white border-[#7A4B29] shadow-sm"
                        : "bg-white text-[#1B1410] border-[#E8E1D7] hover:border-[#7A4B29] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-white/20 text-white" : "bg-[#FAF7F2] text-[#7A4B29]"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{area.name}</div>
                        <div
                          className={`text-[10px] ${
                            isSelected ? "text-white/80" : "text-[#8F8177]"
                          }`}
                        >
                          Bhubaneswar
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-[#8F8177]">
              More cities across Odisha & Eastern India expanding soon.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

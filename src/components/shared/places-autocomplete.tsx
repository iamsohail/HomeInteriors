"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";

export interface PlaceResult {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
}

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
}

interface Suggestion {
  description: string;
  placeId: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

async function fetchSuggestionsFromAPI(input: string): Promise<Suggestion[]> {
  if (!API_KEY || input.length < 3) return [];

  const res = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
      },
      body: JSON.stringify({
        input,
        includedRegionCodes: ["in"],
        languageCode: "en",
      }),
    }
  );

  if (!res.ok) return [];
  const data = await res.json();

  return (data.suggestions || [])
    .filter((s: { placePrediction?: unknown }) => s.placePrediction)
    .map(
      (s: {
        placePrediction: {
          text: { text: string };
          placeId: string;
        };
      }) => ({
        description: s.placePrediction.text.text,
        placeId: s.placePrediction.placeId,
      })
    );
}

async function fetchPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  if (!API_KEY) return null;

  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "formattedAddress,addressComponents,location",
      },
    }
  );

  if (!res.ok) return null;
  const place = await res.json();

  const get = (type: string) =>
    place.addressComponents?.find(
      (c: { types: string[] }) => c.types.includes(type)
    )?.longText || "";

  return {
    address: place.formattedAddress || "",
    city: get("locality") || get("administrative_area_level_2") || "",
    state: get("administrative_area_level_1"),
    postalCode: get("postal_code"),
    lat: place.location?.latitude || 0,
    lng: place.location?.longitude || 0,
  };
}

export function PlacesAutocomplete({
  onPlaceSelect,
  placeholder = "Search for your address...",
  className,
  disabled,
  defaultValue = "",
}: PlacesAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const items = await fetchSuggestionsFromAPI(value);
      setSuggestions(items);
      setShowDropdown(items.length > 0);
      setActiveIndex(-1);
    }, 300);
  };

  const handleSelect = useCallback(
    async (suggestion: Suggestion) => {
      setQuery(suggestion.description);
      setShowDropdown(false);
      setSuggestions([]);

      const details = await fetchPlaceDetails(suggestion.placeId);
      if (details) {
        onPlaceSelect(details);
      } else {
        onPlaceSelect({
          address: suggestion.description,
          city: "",
          state: "",
          postalCode: "",
          lat: 0,
          lng: 0,
        });
      }
    },
    [onPlaceSelect]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-auto rounded-xl border border-white/15 bg-neutral-900/95 p-1.5 shadow-xl backdrop-blur-xl">
          {suggestions.map((s, i) => (
            <li
              key={s.placeId}
              onMouseDown={() => handleSelect(s)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                i === activeIndex
                  ? "bg-white/15 text-white"
                  : "text-white/75 hover:bg-white/10"
              }`}
            >
              <svg
                className="size-4 shrink-0 text-white/40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="truncate">{s.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

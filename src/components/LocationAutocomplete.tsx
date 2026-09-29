import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cn } from "../lib/utils";
import { ONTARIO_LOCATIONS } from "../data/locations";

// Customer flow fix (owner-approved 2026-09-28): searchable autocomplete
// over a real (if finite/static -- see src/data/locations.ts) list of
// Ontario city/area names, replacing the old 6-value hardcoded <Select>.
// Deliberately a plain controlled <input> + absolutely-positioned option
// list, no Popover/Command primitive -- none is installed in this project
// and adding one is out of scope for a "fix only" pass.
//
// Behavior: typing filters the list (case-insensitive substring match);
// clicking or Enter-ing a suggestion commits it; Escape/blur closes the
// list without discarding whatever text is currently in the field (the
// value is a free-form string on the Context either way, same as the old
// Select stored a plain string -- this never blocks the field on an exact
// list match, to avoid a regression for anyone who had already typed a
// custom area).
export const LocationAutocomplete = ({
  value,
  onChange,
  placeholder = "City or area",
  className,
  error = false,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  id?: string;
}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep the visible text in sync if the value changes from outside
  // (e.g. New Order resetting the draft).
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const matches =
    query.trim() === ""
      ? ONTARIO_LOCATIONS
      : ONTARIO_LOCATIONS.filter((option) =>
          option.toLowerCase().includes(query.trim().toLowerCase()),
        );

  const commit = (next: string) => {
    setQuery(next);
    onChange(next);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        // Free-form text the customer typed but never picked from the list
        // is still a valid Approximate Location string -- commit it as-is.
        onChange(query);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (matches.length > 0) {
        commit(matches[0]);
      } else {
        commit(query);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-label="Approximate Location"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          "flex h-11 w-full rounded-[10px] border-2 bg-white px-3 text-sm text-[#012878] shadow-none placeholder:text-[#7a7a7a] focus-visible:outline-none",
          error ? "border-[#c0392b]" : "border-[#012878]",
          className,
        )}
      />
      {open && matches.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-[220px] w-full overflow-y-auto rounded-[10px] border-2 border-[#012878] bg-white shadow-md"
        >
          {matches.map((option) => (
            <li key={option} role="option" aria-selected={option === value}>
              <button
                type="button"
                onMouseDown={(event) => {
                  // mousedown (not click) so this fires before the input's
                  // blur/click-outside handler above closes the list.
                  event.preventDefault();
                  commit(option);
                }}
                className={cn(
                  "block w-full px-3 py-2 text-left text-sm text-[#012878] hover:bg-[#eef2f7]",
                  option === value && "bg-[#eef2f7] font-bold",
                )}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import ChallengeCard from "../challenges/ChallengeCard";
import { challengeCategories, challengeList } from "../../data/challengesPage";

import { studentDashboardNavItems } from "../../data/studentDashboard";

// Local aliases used by this page.
const challenges = challengeList;

function SearchFilters({ query, onQueryChange, activeCategory, onClearAll }) {
  return (
    <section className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.15)]">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-full border border-white/[0.06] bg-[#0F1728] px-4 text-[#9AA7BA]">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-[#8E9AAF] outline-none"
            placeholder="Search by title, company, skill..."
            type="search"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-[#9AA7BA]">
        <span>Active filters:</span>
        {query.trim().length > 0 && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-3 py-1.5 font-bold text-[#A879FF]"
            key="query"
          >
            Search: “{query.trim().slice(0, 24)}”
            <X size={13} />
          </span>
        )}
        {activeCategory !== "All" && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-3 py-1.5 font-bold text-[#A879FF]"
            key="category"
          >
            {activeCategory}
            <X size={13} />
          </span>
        )}
        {(query.trim().length > 0 || activeCategory !== "All") && (
          <button
            className="font-semibold text-[#9AA7BA] hover:text-white"
            type="button"
            onClick={onClearAll}
          >
            Clear all
          </button>
        )}
        {query.trim().length === 0 && activeCategory === "All" && (
          <span className="font-semibold text-[#9AA7BA]">None</span>
        )}
      </div>
    </section>
  );
}

function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  return (
    <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[14px] text-[#9AA7BA]">
        Page {page} of {pageCount}
      </p>
      <div className="flex items-center gap-2">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA] disabled:opacity-50"
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1)
          .slice(Math.max(0, page - 2), Math.min(pageCount, page + 1))
          .map((p) => (
            <button
              className={`flex h-10 w-10 items-center justify-center rounded-2xl text-[14px] font-bold ${
                p === page
                  ? "bg-[#8B5CF6] text-white"
                  : "bg-[#182237] text-[#9AA7BA]"
              }`}
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA] disabled:opacity-50"
          type="button"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA]"
          type="button"
          aria-label="More"
          onClick={() => {
            // UI-only placeholder
          }}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const categoryToTag = (cat) => {
      // Map UI categories to tags stored in challenge data.
      switch (cat) {
        case "Business":
          return "Strategy";
        case "Technology":
          return "Machine Learning";
        case "Design":
          return "UI/UX";
        case "Social Impact":
          return "Impact";
        case "Finance":
          return "Finance";
        case "Healthcare":
          return "Healthcare";
        default:
          return null;
      }
    };

    const tagNeedle = categoryToTag(activeCategory);

    let list = challenges.filter((c) => {
      const matchesCategory =
        !tagNeedle ||
        (c.tags || []).some(
          (t) => String(t).toLowerCase() === tagNeedle.toLowerCase(),
        );

      const matchesQuery =
        !q ||
        [c.title, c.company, ...(c.tags || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);

      return matchesCategory && matchesQuery;
    });

    // We don't have timestamps in the mock data; keeping stable order.
    if (!sortNewestFirst) list = list.slice().reverse();

    return list;
  }, [query, activeCategory, sortNewestFirst]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);

  const pagedChallenges = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const clearAll = () => {
    setQuery("");
    setActiveCategory("All");
    setSortNewestFirst(true);
    setPage(1);
  };

  return (
    <DashboardLayout
      navItems={studentDashboardNavItems}
      activeIndex={2}
      bottomPanel={null}
      topbar={<Topbar />}
    >
      <motion.main
        className="mx-auto max-w-[1460px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <h2 className="text-[32px] font-extrabold leading-tight text-white lg:text-[38px]">
              Browse Challenges
            </h2>
            <p className="mt-3 max-w-[760px] text-[17px] leading-7 text-[#9AA7BA]">
              Discover and solve real business problems from Africa's top
              companies.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <SearchFilters
            query={query}
            onQueryChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            activeCategory={activeCategory}
            onClearAll={clearAll}
          />
        </div>

        {/* Category filter bar */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {challengeCategories.map(([category, count], index) => {
            const isActive = category === activeCategory;
            return (
              <button
                className={`flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[14px] font-bold transition ${
                  isActive
                    ? "bg-[#8B5CF6] text-white shadow-[0_12px_28px_rgba(139,92,246,0.28)]"
                    : index === 0
                      ? "bg-[#182237] text-[#A6B1C4] hover:bg-[#202B43] hover:text-white"
                      : "bg-[#182237] text-[#A6B1C4] hover:bg-[#202B43] hover:text-white"
                }`}
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setPage(1);
                }}
                aria-pressed={isActive}
              >
                {category}
                {count && (
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[12px]">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-[14px] text-[#9AA7BA]">
            Showing {pagedChallenges.length} of {filtered.length} challenges
          </p>
          <div className="flex items-center gap-3">
            <label className="relative flex">
              <select
                value={sortNewestFirst ? "newest" : "oldest"}
                onChange={(e) => {
                  setSortNewestFirst(e.target.value === "newest");
                  setPage(1);
                }}
                className="appearance-none flex h-10 items-center gap-2 rounded-full bg-[#182237] px-4 pr-9 text-[14px] font-semibold text-[#9AA7BA] outline-none focus:ring-2 focus:ring-violet-400/30"
                aria-label="Sort challenges"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9AA7BA]">
                <ChevronDown size={15} />
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 min-[1240px]:grid-cols-3">
          {pagedChallenges.map((challenge) => (
            <ChallengeCard
              challenge={challenge}
              key={challenge.slug || challenge.title}
            />
          ))}
        </div>
        <div className="mt-9">
          <Pagination
            page={safePage}
            pageCount={pageCount}
            onPageChange={(n) => setPage(n)}
          />
        </div>
      </motion.main>
    </DashboardLayout>
  );
}

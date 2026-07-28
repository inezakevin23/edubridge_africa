import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import ChallengeCard from "../challenges/ChallengeCard";

import { studentDashboardNavItems } from "../../data/studentDashboard";
import { fetchChallenges } from "../../services/challengeService";

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
            Search: &ldquo;{query.trim().slice(0, 24)}&rdquo;
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
  const [sortBy, setSortBy] = useState("newest");
  const [challengesData, setChallengesData] = useState({
    results: [],
    count: 0,
    page: 1,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  const challenges = challengesData.results;
  const totalPages = challengesData.pages;
  const currentPage = challengesData.page;

  const loadChallenges = useCallback(
    async (pageNum = 1) => {
      const currentRequestId = ++requestIdRef.current;
      // Abort any in-flight request before starting a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      try {
        const params = {
          page: pageNum,
          page_size: 8,
          ...(query.trim() && { search: query.trim() }),
          ...(activeCategory !== "All" && { industry: activeCategory }),
          ...(sortBy !== "newest" && {
            ordering:
              sortBy === "oldest"
                ? "-created_at"
                : sortBy === "alphabetical"
                  ? "title"
                  : "submission_deadline",
          }),
        };

        const data = await fetchChallenges(params, controller.signal);
        // Discard stale responses from earlier navigations
        if (currentRequestId !== requestIdRef.current) return;
        setChallengesData(data);
      } catch (error) {
        // Ignore abort errors from superseded requests
        if (error.name === "CanceledError" || error.name === "AbortError")
          return;
        if (currentRequestId === requestIdRef.current) {
          setChallengesData({ results: [], count: 0, page: 1, pages: 1 });
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [query, activeCategory, sortBy],
  );

  // Load challenges when filters change
  useEffect(() => {
    const timer = setTimeout(() => loadChallenges(1), 0);
    return () => clearTimeout(timer);
  }, [loadChallenges]);

  // Build category filter chips from current results. Always show
  // discovered categories; only attach counts when viewing a single
  // page so the numbers reflect the full filtered set.
  const categories = useMemo(() => {
    const counts = {};
    challenges.forEach((c) => {
      (c.tags || []).forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return [
      ["All", totalPages > 1 ? undefined : challengesData.count],
      ...entries.map(([tag, count]) => [
        tag,
        totalPages > 1 ? undefined : count,
      ]),
    ];
  }, [challenges, challengesData.count, totalPages]);

  const clearAll = () => {
    setQuery("");
    setActiveCategory("All");
    setSortBy("newest");
  };

  return (
    <DashboardLayout
      navItems={studentDashboardNavItems}
      activeIndex={1}
      bottomPanel={null}
      topbar={<Topbar />}
      workspace="student"
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
            }}
            activeCategory={activeCategory}
            onClearAll={clearAll}
          />
        </div>

        {/* Category filter bar */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map(([category, count], index) => {
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
                }}
                aria-pressed={isActive}
              >
                {category}
                {count !== undefined && count !== null && count > 0 && (
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
            Showing {challenges.length} of {challengesData.count} challenges
          </p>
          <div className="flex items-center gap-3">
            <label className="relative flex">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                }}
                className="appearance-none flex h-10 items-center gap-2 rounded-full bg-[#182237] px-4 pr-9 text-[14px] font-semibold text-[#9AA7BA] outline-none focus:ring-2 focus:ring-violet-400/30"
                aria-label="Sort challenges"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="alphabetical">Sort by: A-Z</option>
                <option value="deadline">Sort by: Deadline</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9AA7BA]">
                <ChevronDown size={15} />
              </span>
            </label>
          </div>
        </div>

        {loading ? (
          <p className="mt-8 text-[14px] font-semibold text-[#9AA7BA]">
            Loading live challenges...
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2 min-[1240px]:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard
              challenge={challenge}
              key={challenge.slug || challenge.title}
            />
          ))}
        </div>
        <div className="mt-9">
          <Pagination
            page={currentPage}
            pageCount={totalPages}
            onPageChange={(n) => loadChallenges(n)}
          />
        </div>
      </motion.main>
    </DashboardLayout>
  );
}

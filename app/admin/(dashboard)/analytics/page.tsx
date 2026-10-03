import { prisma } from "@/lib/prisma";
import { TrendChart, BarListChart } from "./AnalyticsCharts";

export const revalidate = 0; // always fresh -- this is a dashboard, not cached content

const SECTION_LABELS: Record<string, string> = {
  home: "Hero",
  work: "Work",
  about: "About",
  help: "Services",
  journal: "Journal",
  contact: "Contact",
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildDailyTrend(
  events: { createdAt: Date }[],
  days: number
): { date: string; count: number }[] {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const event of events) {
    const key = event.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

export default async function AnalyticsPage() {
  const since7 = daysAgo(7);
  const since30 = daysAgo(30);

  const [
    pageviews7,
    pageviews30,
    visitorRows7,
    visitorRows30,
    pageviewTimestamps30,
    referrerGroups,
    deviceGroups,
    sectionGroups,
  ] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { type: "pageview", createdAt: { gte: since7 } },
    }),
    prisma.analyticsEvent.count({
      where: { type: "pageview", createdAt: { gte: since30 } },
    }),
    prisma.analyticsEvent.findMany({
      where: { type: "pageview", createdAt: { gte: since7 } },
      select: { sessionId: true },
      distinct: ["sessionId"],
    }),
    prisma.analyticsEvent.findMany({
      where: { type: "pageview", createdAt: { gte: since30 } },
      select: { sessionId: true },
      distinct: ["sessionId"],
    }),
    prisma.analyticsEvent.findMany({
      where: { type: "pageview", createdAt: { gte: since30 } },
      select: { createdAt: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["referrer"],
      where: { type: "pageview", createdAt: { gte: since30 } },
      _count: { sessionId: true },
      orderBy: { _count: { sessionId: "desc" } },
      take: 6,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["device"],
      where: { type: "pageview", createdAt: { gte: since30 } },
      _count: { sessionId: true },
      orderBy: { _count: { sessionId: "desc" } },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["section"],
      where: { type: "section_view", createdAt: { gte: since30 } },
      _count: { sessionId: true },
      orderBy: { _count: { sessionId: "desc" } },
    }),
  ]);

  const hasAnyData = pageviews30 > 0;

  const trendData = buildDailyTrend(pageviewTimestamps30, 30);

  const referrerData = referrerGroups.map((g) => ({
    label: g.referrer ? hostnameOf(g.referrer) : "Direct",
    count: g._count.sessionId,
  }));

  const deviceData = deviceGroups.map((g) => ({
    label: g.device
      ? g.device.charAt(0).toUpperCase() + g.device.slice(1)
      : "Unknown",
    count: g._count.sessionId,
  }));

  const sectionData = sectionGroups
    .filter((g) => g.section)
    .map((g) => ({
      label: SECTION_LABELS[g.section as string] ?? (g.section as string),
      count: g._count.sessionId,
    }));

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Analytics
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">
        Traffic on your live site, tracked automatically -- no third-party
        service required.
      </p>

      {!hasAnyData ? (
        <div className="rounded-[14px] bg-white p-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-[15px] text-[#6e6e73]">
            No visits recorded yet. Once people start visiting your live
            site, their activity will show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Pageviews (7d)" value={pageviews7} />
            <StatCard label="Pageviews (30d)" value={pageviews30} />
            <StatCard label="Unique visitors (7d)" value={visitorRows7.length} />
            <StatCard label="Unique visitors (30d)" value={visitorRows30.length} />
          </div>

          <div className="mb-6 rounded-[14px] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <h2 className="mb-4 text-[15px] font-medium text-[#1d1d1f]">
              Pageviews, last 30 days
            </h2>
            <TrendChart data={trendData} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <h2 className="mb-4 text-[15px] font-medium text-[#1d1d1f]">
                Top referrers
              </h2>
              {referrerData.length === 0 ? (
                <EmptyChartNote />
              ) : (
                <BarListChart data={referrerData} />
              )}
            </div>

            <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <h2 className="mb-4 text-[15px] font-medium text-[#1d1d1f]">
                Device breakdown
              </h2>
              {deviceData.length === 0 ? (
                <EmptyChartNote />
              ) : (
                <BarListChart data={deviceData} />
              )}
            </div>

            <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <h2 className="mb-4 text-[15px] font-medium text-[#1d1d1f]">
                Most viewed sections
              </h2>
              {sectionData.length === 0 ? (
                <EmptyChartNote />
              ) : (
                <BarListChart data={sectionData} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[14px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <p className="text-[12px] text-[#86868b]">{label}</p>
      <p className="mt-1 text-[24px] font-semibold text-[#1d1d1f]">{value}</p>
    </div>
  );
}

function EmptyChartNote() {
  return (
    <p className="flex h-64 items-center justify-center text-[13px] text-[#86868b]">
      Not enough data yet
    </p>
  );
}

// document.referrer is usually a full URL, but this never trusts that --
// falls back to the raw string rather than ever throwing, since a
// malformed referrer should never break the whole dashboard page.
function hostnameOf(value: string) {
  try {
    return new URL(value).hostname || value;
  } catch {
    return value;
  }
}

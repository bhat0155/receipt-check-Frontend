import { useEffect, useState } from "react";
import { getRecentRecalls } from "../api";
import type { RecallSummary } from "../api";

function RecallsPage() {
  const [recalls, setRecalls] = useState<RecallSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadRecalls() {
      setLoading(true);
      setError(null);

      try {
        const data = await getRecentRecalls();
        if (!isMounted) return;
        setRecalls(data);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong while loading recent recalls.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRecalls();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold mb-2">Recent Canadian Recalls</h1>
        <p className="text-sm opacity-80">
          These are the most recent recalls from the official Government of
          Canada (Last 5 Days).
        </p>
      </section>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 text-sm opacity-80">
          <span className="loading loading-spinner loading-sm" />
          <span>Loading latest recalls...</span>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && recalls.length === 0 && (
        <p className="text-sm opacity-70">
          No recalls found in the current 5-day window. This usually means there
          are no new recalls, or the feed is temporarily unavailable.
        </p>
      )}

      {/* Recalls list */}
      {!loading && !error && recalls.length > 0 && (
        <div className="space-y-3">
          {recalls.map((recall) => {
            const date = new Date(recall.date);
            const url =
              recall.raw && typeof recall.raw.URL === "string"
                ? recall.raw.URL
                : null;

            return (
              <div
                key={recall.id}
                className="card bg-base-100 border border-base-300 shadow-sm"
              >
                <div className="card-body space-y-1">
                  <h2 className="font-semibold text-sm md:text-base">
                    {recall.title}
                  </h2>

                  <p className="text-xs opacity-70">
                    <span className="font-semibold">Category:</span>{" "}
                    {recall.category || "Unknown"}
                  </p>

                  <p className="text-xs opacity-70">
                    <span className="font-semibold">Last updated:</span>{" "}
                    {isNaN(date.getTime())
                      ? recall.date
                      : date.toISOString().slice(0,10)}
                  </p>

                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="link link-primary text-xs"
                    >
                      View official recall notice ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecallsPage;
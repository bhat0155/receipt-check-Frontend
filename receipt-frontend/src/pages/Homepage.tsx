import { useState } from "react";
import type { PurchasedItem, RecallMatch } from "../api";

// All the high-level states our Home page can be in.
// We'll use this to drive button disabled/loading states and what UI to show.
type FlowStatus =
  | "idle" // nothing started yet
  | "uploading" // sending image to backend
  | "processing" // waiting for OCR + LLM to extract items
  | "ready" // items loaded, ready to check recalls
  | "checking" // checking recalls via backend
  | "done" // result ready (recallMatches filled or empty array)
  | "error"; // some error occurred

function HomePage() {
  // Which file the user has chosen in the file input
  const [file, setFile] = useState<File | null>(null);

  // Where we are in the overall flow
  const [status, setStatus] = useState<FlowStatus>("idle");

  // The session ID we get back from the backend after upload
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Purchased items returned from Phase 1 (OCR + LLM extraction)
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);

  // Recall matches returned from Phase 2 (recall comparison)
  const [recallMatches, setRecallMatches] = useState<RecallMatch[] | null>(
    null
  );

  // Simple error message to show to the user if something goes wrong
  const [error, setError] = useState<string | null>(null);

  // NOTE:
  // In Step 3 and Step 4 we'll implement these handlers:
  // - a real "upload & scan" function that uses uploadReceipt + getSession
  // - a real "check recalls" function that uses checkRecalls
  //
  // For now, we just keep placeholders so the file compiles.
  const handleUploadClick = () => {
    console.log("TODO: implement upload & scan logic in Step 3");
  };

  const handleCheckRecallsClick = () => {
    console.log("TODO: implement check recalls logic in Step 4");
  };

  // UI helpers based on status
  const isUploadingOrProcessing =
    status === "uploading" || status === "processing";
  const isChecking = status === "checking";

  const canUpload = !!file && !isUploadingOrProcessing && !isChecking;
  const canCheckRecalls = status === "ready";

  // Disabled flags
  const uploadDisabled = !canUpload;
  const checkDisabled = !canCheckRecalls;

  // Tooltip texts with 🚫 icon, only when disabled
  const uploadTooltip = uploadDisabled
    ? !file
      ? "🚫 Select a receipt image to enable upload."
      : isUploadingOrProcessing
      ? "🚫 Please wait while we scan your receipt."
      : isChecking
      ? "🚫 Please wait until recall check finishes."
      : "🚫 Upload is currently disabled."
    : "";

  const checkRecallsTooltip = checkDisabled
    ? "🚫 Upload and scan a receipt first to enable recall check."
    : "";

  return (
    // Original container: works well on web and mobile.
    // Your <App> layout can still center/constrain width (e.g. max-w-3xl mx-auto p-4).
    <div className="space-y-8">
      {/* Error alert at the top if something went wrong */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Intro */}
      <section>
        <h1 className="text-3xl font-bold mb-2">Upload your receipt</h1>
        <p className="text-sm opacity-80">
          We&apos;ll scan your receipt, list your purchased items, and check them
          against recent Canadian recalls (last 5 days).
        </p>
      </section>

      {/* Upload area */}
      <section className="card bg-base-100 shadow-md">
        <div className="card-body space-y-4">
          <h2 className="card-title">Step 1: Upload &amp; scan</h2>

          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={(e) => {
              // Store the selected file in state
              const selectedFile = e.target.files?.[0] ?? null;
              setFile(selectedFile);
              // Clear previous errors/results when user picks a new file
              setError(null);
              setSessionId(null);
              setPurchasedItems([]);
              setRecallMatches(null);
              setStatus("idle");
            }}
          />

          {/* Custom tooltip wrapper for Upload button */}
          <div className="relative w-full group">
            {uploadDisabled && uploadTooltip && (
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 bg-base-200 text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {uploadTooltip}
              </div>
            )}

            <button
              className={`btn btn-primary w-full border border-white ${
                isUploadingOrProcessing ? "loading" : ""
              }`}
              onClick={handleUploadClick}
              disabled={uploadDisabled}
            >
              {isUploadingOrProcessing ? "Scanning receipt..." : "Upload & Scan"}
            </button>
          </div>

          <p className="text-xs opacity-70">
            We only use your receipt to extract item names and check them
            against recall data. Your session is temporary.
          </p>
        </div>
      </section>

      {/* Purchased items */}
      <section className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Step 2: Review detected items</h2>

          <p className="text-sm opacity-70 mb-2">
            Once we scan your receipt, the list of purchased items will appear
            below.
          </p>

          {/* If we have real items, show them. Otherwise, show placeholder text */}
          {purchasedItems.length > 0 ? (
            <ul className="list-disc ml-5 space-y-1">
              {purchasedItems.map((item, index) => (
                <li key={index}>
                  {item.name}
                  {item.price !== undefined && (
                    <span className="opacity-70">
                      {" "}
                      — ${item.price.toFixed(2)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm opacity-60">
              No items detected yet. Upload and scan a receipt to see them here.
            </p>
          )}
        </div>
      </section>

      {/* Check Recalls */}
      <section className="card bg-base-100 shadow-md">
        <div className="card-body space-y-3">
          <h2 className="card-title">Step 3: Check recalls</h2>
          <p className="text-sm opacity-70">
            After your items are loaded, you&apos;ll be able to check them
            against recent recall notices.
          </p>

          {/* Custom tooltip wrapper for Check Recalls button */}
          <div className="relative w-full group">
            {checkDisabled && checkRecallsTooltip && (
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 bg-base-200 text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {checkRecallsTooltip}
              </div>
            )}

            <button
              className={`btn btn-secondary w-full border border-white ${
                isChecking ? "loading" : ""
              }`}
              onClick={handleCheckRecallsClick}
              disabled={checkDisabled}
            >
              {isChecking ? "Checking recalls..." : "Check Recalls"}
            </button>
          </div>
        </div>
      </section>

      {/* Result box (we'll fill the logic in later steps) */}
      {status === "done" && (
        <section className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body space-y-2">
            <h2 className="card-title">Result</h2>

            {recallMatches && recallMatches.length > 0 ? (
              <>
                <p className="text-sm">
                  We found the following items on your receipt that may be
                  related to recent recalls:
                </p>
                <ul className="list-disc ml-5 space-y-1">
                  {recallMatches.map((match, index) => (
                    <li key={index}>
                      <span className="font-semibold">
                        {match.purchasedItemName}
                      </span>
                      <span className="block text-sm opacity-80">
                        {match.recallTitle}
                      </span>
                      <span className="block text-xs opacity-70">
                        Reason: {match.reason}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm">
                No recalled items were found for this receipt in the recent
                recall data 🎉
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
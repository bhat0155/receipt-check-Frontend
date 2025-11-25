import { useState } from "react";
import type { PurchasedItem, RecallMatch } from "../api";
import { uploadReceipt, checkRecalls } from "../api";

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


  const handleUploadClick = async () => {
    if(!file){
        setError("Please provide a receipt to proceed");
        return;
    }

    // reset error and prev results
    setError(null);
    setRecallMatches(null);

    // show loading
    setStatus("uploading");

    try{
        // call the backend to upload
        const session = await uploadReceipt(file);

        setSessionId(session.id);
        setPurchasedItems(session.purchasedItems ?? []);
        setRecallMatches(session.recallMatches ?? null);

        // if backend recorded any error show them
        if (session.ocrError || session.llmError){
            const messages: string[]=[];
            if(session.ocrError) messages.push(`OCR error: ${session.ocrError}`)
            if(session.llmError) messages.push(`LLM error: ${session.llmError}`)
            setError(messages.join("|"))
            setStatus("error")
            return;
        }
        
        // if we received purchasedItems, we are ready for recall btn
        if(session.purchasedItems && session.purchasedItems.length>0){
            setStatus("ready")
        }else{
            setError("We couldn't detect any items on this receipt. Try a clearer photo or a different receipt.")
            setStatus("error");
        }

    }catch(err){
        console.log(err)
        if(err instanceof Error){
            setError(err.message)
        }else{
            setError("Something went wrong, please try again later")
        }
        setStatus("error")
    }
  };

  const handleCheckRecallsClick = async () => {
        if(!sessionId){
            setError("No active session, please upload a receipt to proceed");
            return;
        }

        setError(null);
        setStatus("checking");

        try{
            const res = await checkRecalls(sessionId);
            const updated = res.updatedMatches;

            setPurchasedItems(updated.purchasedItems ?? []);
            setRecallMatches(updated.recallMatches ?? null);

            if(updated.llmError){
                setError(`AI error while checking recalls ${updated.llmError}`)
                setStatus("error");
                return;
            }

            setStatus("done")
        }catch(err){
            if(err instanceof Error){
                setError(err.message)
            }else{
                setError("Something went wrong while checking recalls, please try again later")
            }
            setStatus("error")
        }
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
  <section
    className={`card shadow-md border ${
      recallMatches && recallMatches.length > 0
        ? "border-red-500 bg-red-900/20"    // 🔴 danger: recall found
        : "border-green-500 bg-green-900/20" // 🟢 safe: no recall
    }`}
  >
    <div className="card-body space-y-3">
      <h2 className="card-title">
        {recallMatches && recallMatches.length > 0
          ? "⚠️ Potential Safety Concern"
          : "🎉 You're Safe"}
      </h2>

      {recallMatches && recallMatches.length > 0 ? (
        <>
          <p className="text-sm">
            We found {recallMatches.length} item
            {recallMatches.length > 1 ? "s" : ""} on your receipt that may be
            linked to recent Canadian recalls. Please review the details below
            and follow the suggested next steps.
          </p>

          <div className="space-y-4">
            {recallMatches.map((match, index) => (
              <div
                key={index}
                className="border border-red-400 bg-red-900/30 rounded-lg p-3 space-y-2"
              >
                <p>
                  <span className="font-semibold">Purchased item at risk:</span>{" "}
                  {match.purchasedItemName}
                </p>

                <p className="text-sm">
                  <span className="font-semibold">Related recall:</span>{" "}
                  {match.recallTitle}
                </p>

                <p className="text-sm">
                  <span className="font-semibold">Reason:</span>{" "}
                  {match.reason}
                </p>

                <p className="text-xs opacity-80">
                  <span className="font-semibold">Next steps:</span>{" "}
                  Visit the official Government of Canada recalls website and
                  search for recall ID{" "}
                  <span className="font-mono">{match.recallId}</span> or the
                  recall title above. Follow the instructions provided (for
                  example, stop using the product, throw it out, or return it to
                  the store if advised).
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm">
          No recalled items were found for this receipt in the recent Canadian
          recall data. Everything looks safe based on the latest 5-day recall
          window. 🎉
        </p>
      )}
    </div>
  </section>
)}
    </div>
  );
}

export default HomePage;
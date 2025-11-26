import type { PurchasedItem, RecallMatch } from "../api";

export type FlowStatus = "idle" | "uploading" | "processing" | "ready" | "checking" | "done" | "error";

export interface HomeState {
    file: File | null
    status : FlowStatus
    sessionId: string | null
    purchasedItems: PurchasedItem[]
    recallMatches: RecallMatch[] | null
    error: string | null
}

export interface HomeActions {
    setFile(file: File | null): void
    setStatus(status: FlowStatus): void
    setSessionId(id: string | null): void
    setPurchasedItems(items: PurchasedItem[]): void
    setRecallMatches(matches: RecallMatch[]|null): void
    setError(error: string|null): void
    resetAll(): void
}
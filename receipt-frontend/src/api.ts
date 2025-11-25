export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export interface PurchasedItem {
    name: string;
    price?: number;
}

export interface RecallMatch {
    reason: string;
    recallId: string;
    recallTitle: string;
    purchasedItemName: string;
}

export interface ReceiptSession {
    id: string;
    createdAt: string;
    purchasedItems: PurchasedItem[] | null;
    recallMatches: RecallMatch|null;
    ocrError: string|null;
    llmError: string | null;
}

export interface CheckRecallsResponse {
    message: string,
    updatedMatches: ReceiptSession;
}

export interface RecallSummary {
    id: string;
    title: string;
    category: string;
    date: string;
    raw: any;
}

// upload receipt
export async function uploadReceipt(file: File):Promise<ReceiptSession>{
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/api/receipts`, {
        method: "POST",
        body: formData
    })

    if(!res.ok){
        throw new Error(`Failed to upload receipt ${res.statusText}`)
    }

    const data = await res.json();
    return data as ReceiptSession;
}

// get receipt
export async function getSession(id: string): Promise<ReceiptSession>{
    const res = await fetch(`${API_BASE_URL}/api/receipts/${id}`);
    if (!res.ok){
        throw new Error(`Failed to get session from id: ${id}`)
    }

    const data = await res.json();
    return data as ReceiptSession
}

// check recalls
export async function checkRecalls(id: string) : Promise<CheckRecallsResponse>{
    const res = await fetch(`${API_BASE_URL}/api/receipts/${id}/check-recalls`, {
        method: "POST"
    })
    if (!res.ok){
        throw new Error(`Failed to check recalls from id: ${id}`)
    }
    const data = await res.json();
    return data as CheckRecallsResponse;
}

// get recent recalls list

export async function getRecentRecalls(): Promise<RecallSummary[]>{
    const res = await fetch(`${API_BASE_URL}/api/recalls/sample`);
    if (!res.ok){
        throw new Error(`Failed to get recent recalls ${res.statusText}`)
    }
    const data = await res.json();
    return data as RecallSummary[]
}

// delete
export async function deleteSession(id: string): Promise<void>{
    const res = await fetch(`${API_BASE_URL}/api/receipts/${id}`, {
    method: "DELETE",
  });

    if (!res.ok){
        throw new Error(`Failed to delete ${res.statusText}`)
    }
}
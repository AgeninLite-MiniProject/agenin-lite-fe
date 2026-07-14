export interface AgentDetail {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    referral_code: string;
    joined_at: string;
    last_transaction_at: string | null;
    status: "ACTIVE" | "PASSIVE";
}

export interface DownlineTransaction {
    id: string;
    product_name: string;
    quantity: number;
    amount: number;
    status: string;
    completed_at: string;
    commission_earned: number;
}

export interface DownlineDetailResponse {
    agent: AgentDetail;
    profit_income_from_agent: number;
    content: DownlineTransaction[];
    totalElements?: number;
    totalPages?: number;
}
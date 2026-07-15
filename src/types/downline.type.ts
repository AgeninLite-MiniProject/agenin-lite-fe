export interface AgentDetail {
  user_id: string;
  user_name: string;
  phone_number: string;
  email: string | null;
  referral_code: string;
  joined_at: string;
  last_transaction_at: string | null;
  status: "ACTIVE" | "PASSIVE";
}

export interface DownlineTransactionItem {
  product_name: string;
  quantity: number;
  amount: number;
  commission_earned: number;
}

export interface DownlineTransaction {
  trx_id?: string;
  trxId?: string;
  items: DownlineTransactionItem[];
  amount: number;
  status: string;
  completed_at: string;
  total_commission_earned: number;
}

export interface DownlineDetailResponse {
  agentDetail: AgentDetail;
  profit_income_from_agent: number;
  content: DownlineTransaction[];
  totalElements?: number;
  totalPages?: number;
}
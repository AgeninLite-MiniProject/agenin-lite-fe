export interface DashboardUser {
    user_id: string;
    user_status: "PASSIVE" | "ACTIVE";
    user_name: string;
    phone_number: string;
    referral_code: string;
    referred_by: string | null;
}

export interface Downliner {
    user_id: string;
    user_name: string;
    phone_number: string;
}

export interface PendingInvitation {
    inviter_id: string;
    inviter_name: string;
    created_at: string;
}

export interface RecentCommission {
    commission_id: string;
    commission_type: "AGENT_FEE" | "SUPER_AGENT_FEE";
    product_name: string;
    commission_amount: number;
    user_name:string;
    created_at: string;
}

export interface DashboardResponse {
    user: DashboardUser;
    total_agent_fee: number;
    total_super_agent_fee: number;
    total_commission: number; 
    downliners: Downliner[];
    pending_invitations_sent: number;
    pending_innvitations_received: PendingInvitation[];
    recent_commissions: RecentCommission[];
}
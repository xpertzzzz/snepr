import { callRpc, queryTable } from "./supabase";

export interface JoinQueueParams {
  salonId: number;
  customerId?: number | null;
  customerName?: string;
  customerPhone?: string;
  serviceId?: number | null;
  serviceName?: string;
  staffId?: number | null;
  barberName?: string;
  joinType?: "remote" | "qr" | "walk_in";
}

export interface QueueTokenDetails {
  success: boolean;
  message?: string;
  tokenCode: string;
  tokenNumber: number;
  salonId: number;
  salonName: string;
  address: string;
  serviceName: string;
  barberName: string;
  chairAssigned: string;
  status: "waiting" | "called" | "in_service" | "completed" | "cancelled" | "no_show";
  stage: number; // 0=cancelled, 1=joined, 2=waiting, 3=called, 4=in_service, 5=completed
  position: number;
  peopleAhead: number;
  waitTimeMins: number;
  isStale: boolean;
  createdAt: string;
  updatedAt: string;
  queue?: any;
}

/**
 * Join a salon queue atomically via Supabase PL/pgSQL RPC
 */
export async function joinQueueAtomic(params: JoinQueueParams): Promise<{
  success: boolean;
  already_active?: boolean;
  message?: string;
  tokenCode: string;
  tokenNumber: number;
  position?: number;
  peopleAhead?: number;
  estimatedWaitMins?: number;
  queue?: any;
}> {
  // If customer is logged in, attach their ID/Name
  let custId = params.customerId;
  let custName = params.customerName;
  let custPhone = params.customerPhone;

  if (!custId) {
    try {
      const sessionStr = localStorage.getItem("snepr_session");
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        custId = session.id || session.userId || 4;
        custName = custName || session.name || "Customer";
        custPhone = custPhone || session.phone || session.mobile || "+91 98765 43210";
      }
    } catch {}
  }

  const result = await callRpc("join_queue_atomic", {
    p_salon_id: params.salonId,
    p_customer_id: custId || 4,
    p_customer_name: custName || "Guest Customer",
    p_customer_phone: custPhone || "+91 98765 43210",
    p_service_id: params.serviceId || null,
    p_service_name: params.serviceName || "Signature Haircut & Style",
    p_staff_id: params.staffId || null,
    p_barber_name: params.barberName || null,
    p_join_type: params.joinType || "remote",
  });

  if (result.success && result.tokenCode) {
    // Cache active token in localStorage for instant hydration
    try {
      localStorage.setItem(
        "snepr_active_queue",
        JSON.stringify({
          tokenCode: result.tokenCode,
          tokenNumber: result.tokenNumber,
          salonId: params.salonId,
          serviceName: params.serviceName || "Signature Haircut & Style",
          barberName: params.barberName || "Stylist",
          position: result.position || 1,
          waitTimeMins: result.estimatedWaitMins || 12,
          stage: 2,
          status: "waiting",
          createdAt: new Date().toISOString(),
        })
      );
    } catch {}
  }

  return result;
}

/**
 * Fetch detailed token information from Supabase
 */
export async function getTokenDetailsAtomic(tokenIdentifier: string): Promise<QueueTokenDetails> {
  const result = await callRpc<QueueTokenDetails>("get_customer_token_details", {
    p_token_identifier: tokenIdentifier,
  });

  if (result && result.success) {
    try {
      localStorage.setItem("snepr_active_queue", JSON.stringify(result));
    } catch {}
  }

  return result;
}

/**
 * Advance queue (Call next customer or Start service)
 */
export async function advanceQueueAtomic(
  queueId: number,
  chairNumber: number = 1,
  barberName?: string,
  action: "call" | "start" = "call"
) {
  return await callRpc("advance_queue_atomic", {
    p_queue_id: queueId,
    p_chair_number: chairNumber,
    p_barber_name: barberName || null,
    p_action: action,
  });
}

/**
 * Complete service and credit Snepr loyalty points
 */
export async function completeQueueAtomic(queueId: number, pointsReward: number = 10) {
  return await callRpc("complete_queue_atomic", {
    p_queue_id: queueId,
    p_points_reward: pointsReward,
  });
}

/**
 * Cancel or mark no-show
 */
export async function cancelQueueAtomic(
  queueId: number,
  reason: string = "Cancelled by user",
  actorRole: "customer" | "staff" | "admin" = "customer"
) {
  return await callRpc("cancel_queue_atomic", {
    p_queue_id: queueId,
    p_reason: reason,
    p_actor_role: actorRole,
  });
}

/**
 * Fetch live active queues for a salon
 */
export async function fetchSalonLiveQueues(salonId: number) {
  return await queryTable(
    `queues?salon_id=eq.${salonId}&status=in.(waiting,called,in_service)&order=id.asc`
  );
}


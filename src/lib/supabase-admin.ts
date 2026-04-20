import { createClient } from '@supabase/supabase-js'
import type { Order } from '@/lib/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export interface LoshuCalculatorLead {
  id: string
  full_name: string
  dob: string
  mobile_number: string
  created_at: string
}

export interface AdminEnquiry {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  created_at: string
}

export async function createAdminOrder(order: Omit<Order, 'id' | 'created_at'>) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert(order)
    .select()
    .single()

  if (error) throw error
  return data as Order
}

export async function updateAdminOrder(
  id: string,
  updates: Partial<Omit<Order, 'id' | 'created_at'>>
) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Order
}

export async function updateAdminOrderToPaidOnce(
  id: string,
  updates: Partial<Omit<Order, 'id' | 'created_at'>>
) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ ...updates, status: 'paid' })
    .eq('id', id)
    .neq('status', 'paid')
    .select()
    .maybeSingle()

  if (error) throw error
  return (data as Order | null) ?? null
}

export async function updateAdminOrderByRazorpayOrderId(
  razorpayOrderId: string,
  updates: Partial<Omit<Order, 'id' | 'created_at'>>
) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('razorpay_order_id', razorpayOrderId)
    .select()
    .single()

  if (error) throw error
  return data as Order
}

export async function updateAdminOrderToPaidByRazorpayOrderIdOnce(
  razorpayOrderId: string,
  updates: Partial<Omit<Order, 'id' | 'created_at'>>
) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ ...updates, status: 'paid' })
    .eq('razorpay_order_id', razorpayOrderId)
    .neq('status', 'paid')
    .select()
    .maybeSingle()

  if (error) throw error
  return (data as Order | null) ?? null
}

export async function getAdminOrderById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Order
}

export async function getAdminOrderByRazorpayOrderId(razorpayOrderId: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('razorpay_order_id', razorpayOrderId)
    .single()

  if (error) throw error
  return data as Order
}

export async function listAdminOrders(from: number, to: number) {
  const { data, error, count } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    items: (data ?? []) as Order[],
    total: count ?? 0,
  }
}

export async function listAdminLoshuCalculatorLeads(from: number, to: number) {
  const { data, error, count } = await supabaseAdmin
    .from('LoshuCalculator')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    items: (data ?? []) as LoshuCalculatorLead[],
    total: count ?? 0,
  }
}

export async function listAdminEnquiries(from: number, to: number) {
  const { data, error, count } = await supabaseAdmin
    .from('enquiries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    items: (data ?? []) as AdminEnquiry[],
    total: count ?? 0,
  }
}

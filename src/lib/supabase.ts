import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnon)

// ============================================================
// ORDER OPERATIONS
// ============================================================
export interface Order {
  id?: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  package_id: string
  package_name: string
  amount: number
  currency: string
  status: 'created' | 'authorized' | 'paid' | 'failed' | 'refunded'
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  numerology_dob?: string
  notes?: string
  created_at?: string
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()
  if (error) throw error
  return data as Order
}

export async function updateOrderStatus(
  id: string,
  status: Order['status'],
  paymentData?: {
    razorpay_payment_id?: string
    razorpay_order_id?: string
    razorpay_signature?: string
  }
) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, ...paymentData })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Order
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Order
}

// ============================================================
// ENQUIRY OPERATIONS
// ============================================================
export interface Enquiry {
  id?: string
  name: string
  email: string
  phone?: string
  message: string
  subject?: string
  created_at?: string
}



export async function submitEnquiry(enquiry: Omit<Enquiry, 'id' | 'created_at'>) {
  const { error } = await supabase
    .from('enquiries')
    .insert(enquiry)

  if (error) throw error
}

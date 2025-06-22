import { supabase } from "../supabase-client"
import type { User } from "../supabase-client"

export interface AuditorRegistrationData {
  fullName: string
  phone: string
  email: string
  address: string
  latitude: string
  longitude: string
  aadhaarNumber: string
  drivingLicense?: string
  upiId: string
  bankAccount?: string
  experience?: string
}

export interface SupplierRegistrationData {
  companyName: string
  contactPerson: string
  phone: string
  email: string
  address: string
  latitude: string
  longitude: string
  aadhaarNumber: string
  gstNumber?: string
  upiId: string
  bankAccount?: string
  vehicleDetails: string
  serviceAreas: string
}

export async function registerAuditor(formData: AuditorRegistrationData): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert({
      email: formData.email,
      role: "auditor",
      full_name: formData.fullName,
      phone: formData.phone,
      location: `POINT(${formData.longitude} ${formData.latitude})`,
      address: formData.address,
      aadhaar_number: formData.aadhaarNumber,
      driving_license: formData.drivingLicense || null,
      upi_id: formData.upiId,
      bank_account: formData.bankAccount || null,
      is_active: false, // Pending approval
    })
    .select()
    .single()

  if (error) {
    console.error("Error registering auditor:", error)
    throw error
  }

  return data
}

export async function registerSupplier(formData: SupplierRegistrationData): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert({
      email: formData.email,
      role: "supplier",
      full_name: formData.companyName,
      phone: formData.phone,
      location: `POINT(${formData.longitude} ${formData.latitude})`,
      address: formData.address,
      aadhaar_number: formData.aadhaarNumber,
      upi_id: formData.upiId,
      bank_account: formData.bankAccount || null,
      is_active: false, // Pending approval
    })
    .select()
    .single()

  if (error) {
    console.error("Error registering supplier:", error)
    throw error
  }

  return data
}

export async function getAuditors(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "auditor")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching auditors:", error)
    throw error
  }

  return data || []
}

export async function getSuppliers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "supplier")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching suppliers:", error)
    throw error
  }

  return data || []
}

export async function updateUserStatus(
  userId: string,
  isActive: boolean,
  isFrozen?: boolean,
  freezeReason?: string,
): Promise<void> {
  const updateData: any = {
    is_active: isActive,
    updated_at: new Date().toISOString(),
  }

  if (isFrozen !== undefined) {
    updateData.is_frozen = isFrozen
  }

  if (freezeReason) {
    updateData.freeze_reason = freezeReason
  }

  const { error } = await supabase.from("users").update(updateData).eq("id", userId)

  if (error) {
    console.error("Error updating user status:", error)
    throw error
  }
}

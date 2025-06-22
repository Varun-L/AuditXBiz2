import { supabase } from "../supabase-client"
import type { Business, Category } from "../supabase-client"

export interface BusinessRegistrationData {
  businessName: string
  ownerName: string
  ownerPhone: string
  ownerEmail?: string
  category: string
  address: string
  latitude: string
  longitude: string
  licenseNumber?: string
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    throw error
  }

  return data || []
}

export async function registerBusiness(formData: BusinessRegistrationData): Promise<Business> {
  // First, get the category ID
  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("name", formData.category.charAt(0).toUpperCase() + formData.category.slice(1))
    .single()

  if (categoryError) {
    console.error("Error finding category:", categoryError)
    throw new Error("Invalid category selected")
  }

  // Create the business record
  const { data, error } = await supabase
    .from("businesses")
    .insert({
      name: formData.businessName,
      category_id: categories.id,
      owner_name: formData.ownerName,
      owner_phone: formData.ownerPhone,
      owner_email: formData.ownerEmail || null,
      location: `POINT(${formData.longitude} ${formData.latitude})`,
      address: formData.address,
      license_number: formData.licenseNumber || null,
      certification_status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error registering business:", error)
    throw error
  }

  return data
}

export async function getBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select(`
      *,
      categories (
        name,
        payout_amount
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching businesses:", error)
    throw error
  }

  return data || []
}

export async function updateBusinessCertification(
  businessId: string,
  status: "certified" | "rejected",
  score?: number,
  reason?: string,
): Promise<void> {
  const updateData: any = {
    certification_status: status,
    updated_at: new Date().toISOString(),
  }

  if (score !== undefined) {
    updateData.certification_score = score
  }

  if (status === "certified" && score && score >= 70) {
    updateData.can_list_products = true
  }

  if (status === "rejected" && reason) {
    updateData.rejection_reason = reason
  }

  const { error } = await supabase.from("businesses").update(updateData).eq("id", businessId)

  if (error) {
    console.error("Error updating business certification:", error)
    throw error
  }
}

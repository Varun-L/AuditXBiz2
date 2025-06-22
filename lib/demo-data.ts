// Demo data for the application
export const demoUsers = [
  {
    id: "admin-1",
    role: "admin" as const,
    full_name: "Admin User",
    email: "admin@auditpro.com",
    phone_number: "+91 9876543210",
    address: "123 Admin Street",
    city: "Mumbai",
    pin_code: "400001",
  },
  {
    id: "auditor-1",
    role: "auditor" as const,
    full_name: "John Auditor",
    email: "john@auditpro.com",
    phone_number: "+91 9876543211",
    address: "456 Auditor Lane",
    city: "Mumbai",
    pin_code: "400002",
    upi_handle: "john@paytm",
    bank_account_number: "1234567890",
  },
  {
    id: "supplier-1",
    role: "supplier" as const,
    full_name: "Supply Chain Co",
    email: "supplier@auditpro.com",
    phone_number: "+91 9876543212",
    address: "789 Supply Road",
    city: "Mumbai",
    pin_code: "400003",
  },
  {
    id: "consumer-1",
    role: "consumer" as const,
    full_name: "Jane Consumer",
    email: "jane@auditpro.com",
    phone_number: "+91 9876543213",
    address: "321 Consumer Street",
    city: "Mumbai",
    pin_code: "400004",
  },
]

export const demoCategories = [
  {
    id: "cat-1",
    name: "Restaurant",
    payout_amount: 20000,
    checklist: {
      questions: [
        {
          id: "cleanliness_rating",
          question: "Cleanliness rating (1-10)?",
          type: "rating",
          min: 1,
          max: 10,
          required: true,
        },
        {
          id: "ingredient_quality",
          question: "Quality of ingredients used?",
          type: "text_input",
          required: true,
        },
        {
          id: "health_certificates",
          question: "Are health and safety certificates visible?",
          type: "checkbox",
          required: true,
        },
        {
          id: "kitchen_photo",
          question: "Upload photo of kitchen cleanliness.",
          type: "photo_upload",
          required: true,
        },
      ],
    },
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Medical Clinic",
    payout_amount: 25000,
    checklist: {
      questions: [
        {
          id: "facility_cleanliness",
          question: "Overall facility cleanliness (1-10)?",
          type: "rating",
          min: 1,
          max: 10,
          required: true,
        },
        {
          id: "equipment_condition",
          question: "Condition of medical equipment?",
          type: "text_input",
          required: true,
        },
        {
          id: "staff_hygiene",
          question: "Staff following proper hygiene protocols?",
          type: "checkbox",
          required: true,
        },
        {
          id: "facility_photo",
          question: "Upload photo of main facility area.",
          type: "photo_upload",
          required: true,
        },
      ],
    },
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "cat-3",
    name: "Retail Store",
    payout_amount: 15000,
    checklist: {
      questions: [
        {
          id: "store_organization",
          question: "Store organization and cleanliness (1-10)?",
          type: "rating",
          min: 1,
          max: 10,
          required: true,
        },
        {
          id: "product_quality",
          question: "Overall product quality assessment?",
          type: "text_input",
          required: true,
        },
        {
          id: "customer_service",
          question: "Staff provides good customer service?",
          type: "checkbox",
          required: true,
        },
        {
          id: "store_photo",
          question: "Upload photo of store interior.",
          type: "photo_upload",
          required: true,
        },
      ],
    },
    created_at: "2024-01-03T00:00:00Z",
  },
]

export const demoBusinesses = [
  {
    id: "biz-1",
    name: "Spice Garden Restaurant",
    category_id: "cat-1",
    address: "123 Food Street, Bandra West",
    city: "Mumbai",
    pin_code: "400050",
    phone_number: "+91 9876543220",
    email: "info@spicegarden.com",
    created_at: "2024-01-10T00:00:00Z",
    business_categories: { name: "Restaurant" },
  },
  {
    id: "biz-2",
    name: "HealthCare Plus Clinic",
    category_id: "cat-2",
    address: "456 Medical Lane, Andheri East",
    city: "Mumbai",
    pin_code: "400069",
    phone_number: "+91 9876543221",
    email: "contact@healthcareplus.com",
    created_at: "2024-01-11T00:00:00Z",
    business_categories: { name: "Medical Clinic" },
  },
  {
    id: "biz-3",
    name: "Fashion Hub Store",
    category_id: "cat-3",
    address: "789 Shopping Complex, Powai",
    city: "Mumbai",
    pin_code: "400076",
    phone_number: "+91 9876543222",
    email: "sales@fashionhub.com",
    created_at: "2024-01-12T00:00:00Z",
    business_categories: { name: "Retail Store" },
  },
  {
    id: "biz-4",
    name: "Cafe Delight",
    category_id: "cat-1",
    address: "321 Coffee Street, Juhu",
    city: "Mumbai",
    pin_code: "400049",
    phone_number: "+91 9876543223",
    email: "hello@cafedelight.com",
    created_at: "2024-01-13T00:00:00Z",
    business_categories: { name: "Restaurant" },
  },
  {
    id: "biz-5",
    name: "City Medical Center",
    category_id: "cat-2",
    address: "654 Health Avenue, Malad",
    city: "Mumbai",
    pin_code: "400064",
    phone_number: "+91 9876543224",
    email: "info@citymedical.com",
    created_at: "2024-01-14T00:00:00Z",
    business_categories: { name: "Medical Clinic" },
  },
  {
    id: "biz-6",
    name: "Tech Gadgets Store",
    category_id: "cat-3",
    address: "987 Electronics Market, Goregaon",
    city: "Mumbai",
    pin_code: "400062",
    phone_number: "+91 9876543225",
    email: "support@techgadgets.com",
    created_at: "2024-01-15T00:00:00Z",
    business_categories: { name: "Retail Store" },
  },
]

export const demoSupplierTasks = [
  {
    id: "st-1",
    supplier_id: "supplier-1",
    business_id: "biz-1",
    status: "package_delivered" as const,
    created_at: "2024-01-10T00:00:00Z",
    businesses: demoBusinesses[0],
    profiles: { full_name: "Supply Chain Co" },
  },
  {
    id: "st-2",
    supplier_id: "supplier-1",
    business_id: "biz-2",
    status: "package_sent" as const,
    created_at: "2024-01-11T00:00:00Z",
    businesses: demoBusinesses[1],
    profiles: { full_name: "Supply Chain Co" },
  },
  {
    id: "st-3",
    supplier_id: "supplier-1",
    business_id: "biz-3",
    status: "in_progress" as const,
    created_at: "2024-01-12T00:00:00Z",
    businesses: demoBusinesses[2],
    profiles: { full_name: "Supply Chain Co" },
  },
  {
    id: "st-4",
    supplier_id: "supplier-1",
    business_id: "biz-4",
    status: "todo" as const,
    created_at: "2024-01-13T00:00:00Z",
    businesses: demoBusinesses[3],
    profiles: { full_name: "Supply Chain Co" },
  },
]

export const demoAuditorTasks = [
  {
    id: "at-1",
    auditor_id: "auditor-1",
    business_id: "biz-1",
    category_id: "cat-1",
    status: "completed" as const,
    payout_amount: 20000,
    created_at: "2024-01-10T00:00:00Z",
    businesses: demoBusinesses[0],
    business_categories: { name: "Restaurant" },
    profiles: { full_name: "John Auditor" },
  },
  {
    id: "at-2",
    auditor_id: "auditor-1",
    business_id: "biz-2",
    category_id: "cat-2",
    status: "in_progress" as const,
    payout_amount: 25000,
    created_at: "2024-01-11T00:00:00Z",
    businesses: demoBusinesses[1],
    business_categories: { name: "Medical Clinic" },
    profiles: { full_name: "John Auditor" },
  },
  {
    id: "at-3",
    auditor_id: "auditor-1",
    business_id: "biz-3",
    category_id: "cat-3",
    status: "not_started" as const,
    payout_amount: 15000,
    created_at: "2024-01-12T00:00:00Z",
    businesses: demoBusinesses[2],
    business_categories: { name: "Retail Store" },
    profiles: { full_name: "John Auditor" },
  },
]

export const demoAuditReports = [
  {
    id: "ar-1",
    auditor_task_id: "at-1",
    auditor_id: "auditor-1",
    business_id: "biz-1",
    responses: {
      cleanliness_rating: [8],
      ingredient_quality: "Fresh ingredients, well-maintained storage",
      health_certificates: true,
      kitchen_photo: "/placeholder.svg?height=200&width=300&text=Kitchen+Photo",
    },
    photos: ["/placeholder.svg?height=200&width=300&text=Kitchen+Photo"],
    submitted_at: "2024-01-10T12:00:00Z",
    businesses: { name: "Spice Garden Restaurant" },
    profiles: { full_name: "John Auditor" },
  },
]

// Helper functions for demo data management
export const getDemoCategories = () => {
  return [...demoCategories]
}

export const createDemoCategory = (categoryData: any) => {
  const newCategory = {
    id: `cat-${Date.now()}`,
    ...categoryData,
    created_at: new Date().toISOString(),
  }
  demoCategories.push(newCategory)
  return newCategory
}

export const createDemoBusiness = (businessData: any) => {
  const categoryName = demoCategories.find((cat) => cat.id === businessData.category_id)?.name || "Unknown"

  const newBusiness = {
    id: `biz-${Date.now()}`,
    ...businessData,
    created_at: new Date().toISOString(),
    business_categories: { name: categoryName },
  }

  demoBusinesses.push(newBusiness)
  return newBusiness
}

export const getDemoBusinesses = () => {
  return [...demoBusinesses]
}

export const getDemoUsers = () => {
  return [...demoUsers]
}

export const getDemoSupplierTasks = () => {
  return [...demoSupplierTasks]
}

export const getDemoAuditorTasks = () => {
  return [...demoAuditorTasks]
}

export const getDemoAuditReports = () => {
  return [...demoAuditReports]
}

// Demo authentication
export const demoAuth = {
  currentUser: null as (typeof demoUsers)[0] | null,

  signIn: (email: string, password: string) => {
    // Simple demo authentication
    const user = demoUsers.find((u) => u.email === email)
    if (user && password === "demo123") {
      demoAuth.currentUser = user
      return { success: true, user }
    }
    return { success: false, error: "Invalid credentials. Use demo123 as password." }
  },

  signUp: (userData: any) => {
    // In demo mode, just create a new user
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
    }
    demoUsers.push(newUser)
    return { success: true, user: newUser }
  },

  signOut: () => {
    demoAuth.currentUser = null
  },

  getCurrentUser: () => demoAuth.currentUser,
}

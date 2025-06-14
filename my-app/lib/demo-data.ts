export interface BusinessCategory {
  id: string
  category_name: string
  payout_amount: number
  checklist: {
    category_name: string
    checklist: Array<{
      question: string
      type: string
      min?: number
      max?: number
    }>
  }
  created_at: string
}

export interface Business {
  id: string
  business_name: string
  address: string
  city: string
  pin_code: string
  category_id: string
  created_at: string
  business_categories?: {
    category_name: string
    checklist?: any
  }
}

export interface SupplierTask {
  id: string
  supplier_id: string
  business_id: string
  status: "to_do" | "in_progress" | "package_sent" | "package_delivered"
  created_at: string
  updated_at: string
  businesses?: Business
}

export interface AuditorTask {
  id: string
  auditor_id: string
  business_id: string
  status: "not_started" | "on_field" | "in_progress" | "completed"
  payout_amount: number
  created_at: string
  updated_at: string
  businesses?: Business & {
    business_categories: {
      category_name: string
      checklist: any
    }
  }
}

export interface AuditReport {
  id: string
  auditor_task_id: string
  auditor_id: string
  business_id: string
  responses: Array<{
    question: string
    type: string
    response: any
  }>
  photos: string[]
  submitted_at: string
  users?: {
    full_name: string
  }
  businesses?: Business & {
    business_categories: {
      category_name: string
    }
  }
}

// Mock Business Categories
export const mockBusinessCategories: BusinessCategory[] = [
  {
    id: "cat-restaurant",
    category_name: "Restaurant",
    payout_amount: 20000, // ₹200 in paise
    checklist: {
      category_name: "Restaurant",
      checklist: [
        {
          question: "Cleanliness rating (1-10)?",
          type: "rating",
          min: 1,
          max: 10,
        },
        {
          question: "Quality of ingredients used?",
          type: "text_input",
        },
        {
          question: "Are health and safety certificates visible?",
          type: "checkbox",
        },
        {
          question: "Upload photo of kitchen cleanliness.",
          type: "photo_upload",
        },
      ],
    },
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "cat-medical",
    category_name: "Medical Clinic",
    payout_amount: 30000, // ₹300 in paise
    checklist: {
      category_name: "Medical Clinic",
      checklist: [
        {
          question: "Hygiene standards rating (1-10)?",
          type: "rating",
          min: 1,
          max: 10,
        },
        {
          question: "Are medical licenses displayed?",
          type: "checkbox",
        },
        {
          question: "Describe the waiting area condition",
          type: "text_input",
        },
        {
          question: "Upload photo of reception area",
          type: "photo_upload",
        },
      ],
    },
    created_at: "2024-01-16T11:00:00Z",
  },
  {
    id: "cat-retail",
    category_name: "Retail Store",
    payout_amount: 15000, // ₹150 in paise
    checklist: {
      category_name: "Retail Store",
      checklist: [
        {
          question: "Store organization rating (1-10)?",
          type: "rating",
          min: 1,
          max: 10,
        },
        {
          question: "Customer service quality?",
          type: "text_input",
        },
        {
          question: "Are prices clearly displayed?",
          type: "checkbox",
        },
        {
          question: "Upload photo of store front",
          type: "photo_upload",
        },
      ],
    },
    created_at: "2024-01-17T12:00:00Z",
  },
  {
    id: "cat-pharmacy",
    category_name: "Pharmacy",
    payout_amount: 25000, // ₹250 in paise
    checklist: {
      category_name: "Pharmacy",
      checklist: [
        {
          question: "Medicine storage rating (1-10)?",
          type: "rating",
          min: 1,
          max: 10,
        },
        {
          question: "Is pharmacist license displayed?",
          type: "checkbox",
        },
        {
          question: "Describe prescription handling process",
          type: "text_input",
        },
        {
          question: "Upload photo of medicine storage area",
          type: "photo_upload",
        },
      ],
    },
    created_at: "2024-01-18T13:00:00Z",
  },
]

// Mock Businesses
export const mockBusinesses: Business[] = [
  {
    id: "biz-spice-garden",
    business_name: "Spice Garden Restaurant",
    address: "123 MG Road, Near City Mall",
    city: "Mumbai",
    pin_code: "400001",
    category_id: "cat-restaurant",
    created_at: "2024-01-20T09:00:00Z",
  },
  {
    id: "biz-city-clinic",
    business_name: "City Medical Clinic",
    address: "456 Park Street, Medical Complex",
    city: "Mumbai",
    pin_code: "400002",
    category_id: "cat-medical",
    created_at: "2024-01-21T10:00:00Z",
  },
  {
    id: "biz-fashion-hub",
    business_name: "Fashion Hub Store",
    address: "789 Commercial Street, Shopping District",
    city: "Bangalore",
    pin_code: "560001",
    category_id: "cat-retail",
    created_at: "2024-01-22T11:00:00Z",
  },
  {
    id: "biz-wellness-pharmacy",
    business_name: "Wellness Pharmacy",
    address: "321 Health Avenue, Medical Zone",
    city: "Delhi",
    pin_code: "110001",
    category_id: "cat-pharmacy",
    created_at: "2024-01-23T12:00:00Z",
  },
  {
    id: "biz-taste-buds",
    business_name: "Taste Buds Cafe",
    address: "654 Food Court, Central Plaza",
    city: "Chennai",
    pin_code: "600001",
    category_id: "cat-restaurant",
    created_at: "2024-01-24T13:00:00Z",
  },
  {
    id: "biz-family-clinic",
    business_name: "Family Care Clinic",
    address: "987 Residential Area, Sector 5",
    city: "Pune",
    pin_code: "411001",
    category_id: "cat-medical",
    created_at: "2024-01-25T14:00:00Z",
  },
]

// Mock Supplier Tasks
export const mockSupplierTasks: SupplierTask[] = [
  {
    id: "sup-task-1",
    supplier_id: "demo-supplier-id",
    business_id: "biz-spice-garden",
    status: "package_delivered",
    created_at: "2024-01-20T09:30:00Z",
    updated_at: "2024-01-22T15:00:00Z",
  },
  {
    id: "sup-task-2",
    supplier_id: "demo-supplier-id",
    business_id: "biz-city-clinic",
    status: "package_sent",
    created_at: "2024-01-21T10:30:00Z",
    updated_at: "2024-01-23T11:00:00Z",
  },
  {
    id: "sup-task-3",
    supplier_id: "demo-supplier-id",
    business_id: "biz-fashion-hub",
    status: "in_progress",
    created_at: "2024-01-22T11:30:00Z",
    updated_at: "2024-01-22T16:00:00Z",
  },
  {
    id: "sup-task-4",
    supplier_id: "demo-supplier-id",
    business_id: "biz-wellness-pharmacy",
    status: "to_do",
    created_at: "2024-01-23T12:30:00Z",
    updated_at: "2024-01-23T12:30:00Z",
  },
]

// Mock Auditor Tasks
export const mockAuditorTasks: AuditorTask[] = [
  {
    id: "aud-task-1",
    auditor_id: "demo-auditor-id",
    business_id: "biz-spice-garden",
    status: "completed",
    payout_amount: 20000,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-24T16:00:00Z",
  },
  {
    id: "aud-task-2",
    auditor_id: "demo-auditor-id",
    business_id: "biz-city-clinic",
    status: "in_progress",
    payout_amount: 30000,
    created_at: "2024-01-21T11:00:00Z",
    updated_at: "2024-01-25T10:00:00Z",
  },
  {
    id: "aud-task-3",
    auditor_id: "demo-auditor-id",
    business_id: "biz-fashion-hub",
    status: "not_started",
    payout_amount: 15000,
    created_at: "2024-01-22T12:00:00Z",
    updated_at: "2024-01-22T12:00:00Z",
  },
  {
    id: "aud-task-4",
    auditor_id: "demo-auditor-id",
    business_id: "biz-taste-buds",
    status: "not_started",
    payout_amount: 20000,
    created_at: "2024-01-24T14:00:00Z",
    updated_at: "2024-01-24T14:00:00Z",
  },
]

// Mock Audit Reports
export const mockAuditReports: AuditReport[] = [
  {
    id: "report-1",
    auditor_task_id: "aud-task-1",
    auditor_id: "demo-auditor-id",
    business_id: "biz-spice-garden",
    responses: [
      {
        question: "Cleanliness rating (1-10)?",
        type: "rating",
        response: [8],
      },
      {
        question: "Quality of ingredients used?",
        type: "text_input",
        response:
          "Fresh ingredients observed, proper storage maintained. Vegetables looked fresh and meat was properly refrigerated.",
      },
      {
        question: "Are health and safety certificates visible?",
        type: "checkbox",
        response: true,
      },
      {
        question: "Upload photo of kitchen cleanliness.",
        type: "photo_upload",
        response: "Photo uploaded (demo mode)",
      },
    ],
    photos: [],
    submitted_at: "2024-01-24T16:00:00Z",
  },
]

// Helper functions to get mock data with relationships
export const getMockBusinessCategories = (): BusinessCategory[] => {
  return mockBusinessCategories
}

export const getMockBusinesses = (): Business[] => {
  return mockBusinesses.map((business) => ({
    ...business,
    business_categories: mockBusinessCategories.find((cat) => cat.id === business.category_id),
  }))
}

export const getMockSupplierTasks = (supplierId: string): SupplierTask[] => {
  return mockSupplierTasks
    .filter((task) => task.supplier_id === supplierId)
    .map((task) => ({
      ...task,
      businesses: mockBusinesses.find((biz) => biz.id === task.business_id),
    }))
}

export const getMockAuditorTasks = (auditorId: string): AuditorTask[] => {
  return mockAuditorTasks
    .filter((task) => task.auditor_id === auditorId)
    .map((task) => {
      const business = mockBusinesses.find((biz) => biz.id === task.business_id)
      const category = mockBusinessCategories.find((cat) => cat.id === business?.category_id)
      return {
        ...task,
        businesses: business
          ? {
              ...business,
              business_categories: {
                category_name: category?.category_name || "",
                checklist: category?.checklist,
              },
            }
          : undefined,
      }
    })
}

export const getMockAuditReports = (): AuditReport[] => {
  return mockAuditReports.map((report) => {
    const business = mockBusinesses.find((biz) => biz.id === report.business_id)
    const category = mockBusinessCategories.find((cat) => cat.id === business?.category_id)
    return {
      ...report,
      users: {
        full_name: "Mike Auditor",
      },
      businesses: business
        ? {
            ...business,
            business_categories: {
              category_name: category?.category_name || "",
            },
          }
        : undefined,
    }
  })
}

export const getMockAuditorTask = (taskId: string): AuditorTask | null => {
  const task = mockAuditorTasks.find((t) => t.id === taskId)
  if (!task) return null

  const business = mockBusinesses.find((biz) => biz.id === task.business_id)
  const category = mockBusinessCategories.find((cat) => cat.id === business?.category_id)

  return {
    ...task,
    businesses: business
      ? {
          ...business,
          business_categories: {
            category_name: category?.category_name || "",
            checklist: category?.checklist,
          },
        }
      : undefined,
  }
}

// Update task status functions
export const updateMockSupplierTaskStatus = (taskId: string, status: string): boolean => {
  const taskIndex = mockSupplierTasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) {
    mockSupplierTasks[taskIndex].status = status as any
    mockSupplierTasks[taskIndex].updated_at = new Date().toISOString()
    return true
  }
  return false
}

export const updateMockAuditorTaskStatus = (taskId: string, status: string): boolean => {
  const taskIndex = mockAuditorTasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) {
    mockAuditorTasks[taskIndex].status = status as any
    mockAuditorTasks[taskIndex].updated_at = new Date().toISOString()
    return true
  }
  return false
}

export const addMockAuditReport = (report: Omit<AuditReport, "id" | "submitted_at">): boolean => {
  const newReport: AuditReport = {
    ...report,
    id: `report-${Date.now()}`,
    submitted_at: new Date().toISOString(),
  }
  mockAuditReports.push(newReport)

  // Update corresponding auditor task status
  updateMockAuditorTaskStatus(report.auditor_task_id, "completed")

  return true
}

export const addMockBusinessCategory = (category: Omit<BusinessCategory, "id" | "created_at">): boolean => {
  const newCategory: BusinessCategory = {
    ...category,
    id: `cat-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  mockBusinessCategories.push(newCategory)
  return true
}

export const addMockBusiness = (business: Omit<Business, "id" | "created_at">): boolean => {
  const newBusiness: Business = {
    ...business,
    id: `biz-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  mockBusinesses.push(newBusiness)

  // Auto-create supplier and auditor tasks
  const newSupplierTask: SupplierTask = {
    id: `sup-task-${Date.now()}`,
    supplier_id: "demo-supplier-id",
    business_id: newBusiness.id,
    status: "to_do",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const category = mockBusinessCategories.find((cat) => cat.id === business.category_id)
  const newAuditorTask: AuditorTask = {
    id: `aud-task-${Date.now()}`,
    auditor_id: "demo-auditor-id",
    business_id: newBusiness.id,
    status: "not_started",
    payout_amount: category?.payout_amount || 15000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  mockSupplierTasks.push(newSupplierTask)
  mockAuditorTasks.push(newAuditorTask)

  return true
}

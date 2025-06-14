import {
  getMockBusinessCategories,
  getMockBusinesses,
  getMockSupplierTasks,
  getMockAuditorTasks,
  getMockAuditReports,
  getMockAuditorTask,
  updateMockSupplierTaskStatus,
  addMockAuditReport,
  addMockBusinessCategory,
  addMockBusiness,
  type BusinessCategory,
  type Business,
  type SupplierTask,
  type AuditorTask,
  type AuditReport,
} from "./demo-data"

// Demo Supabase client that mimics the real Supabase API
export const createDemoSupabaseClient = () => {
  return {
    from: (table: string) => {
      switch (table) {
        case "business_categories":
          return {
            select: (columns = "*") => ({
              order: (column: string, options?: any) => ({
                then: (callback: (result: { data: BusinessCategory[] | null; error: any }) => void) => {
                  const data = getMockBusinessCategories()
                  callback({ data, error: null })
                  return Promise.resolve({ data, error: null })
                },
              }),
              then: (callback: (result: { data: BusinessCategory[] | null; error: any }) => void) => {
                const data = getMockBusinessCategories()
                callback({ data, error: null })
                return Promise.resolve({ data, error: null })
              },
            }),
            insert: (data: any) => ({
              then: (callback: (result: { data: any; error: any }) => void) => {
                const success = addMockBusinessCategory(data)
                callback({ data: success ? data : null, error: success ? null : { message: "Failed to insert" } })
                return Promise.resolve({
                  data: success ? data : null,
                  error: success ? null : { message: "Failed to insert" },
                })
              },
            }),
          }

        case "businesses":
          return {
            select: (columns = "*") => ({
              order: (column: string, options?: any) => ({
                then: (callback: (result: { data: Business[] | null; error: any }) => void) => {
                  const data = getMockBusinesses()
                  callback({ data, error: null })
                  return Promise.resolve({ data, error: null })
                },
              }),
              then: (callback: (result: { data: Business[] | null; error: any }) => void) => {
                const data = getMockBusinesses()
                callback({ data, error: null })
                return Promise.resolve({ data, error: null })
              },
            }),
            insert: (data: any) => ({
              then: (callback: (result: { data: any; error: any }) => void) => {
                const success = addMockBusiness(data)
                callback({ data: success ? data : null, error: success ? null : { message: "Failed to insert" } })
                return Promise.resolve({
                  data: success ? data : null,
                  error: success ? null : { message: "Failed to insert" },
                })
              },
            }),
          }

        case "supplier_tasks":
          return {
            select: (columns = "*") => ({
              eq: (column: string, value: any) => ({
                order: (orderColumn: string, options?: any) => ({
                  then: (callback: (result: { data: SupplierTask[] | null; error: any }) => void) => {
                    const data = getMockSupplierTasks(value)
                    callback({ data, error: null })
                    return Promise.resolve({ data, error: null })
                  },
                }),
              }),
            }),
            update: (updateData: any) => ({
              eq: (column: string, value: any) => ({
                then: (callback: (result: { data: any; error: any }) => void) => {
                  const success = updateMockSupplierTaskStatus(value, updateData.status)
                  callback({
                    data: success ? updateData : null,
                    error: success ? null : { message: "Failed to update" },
                  })
                  return Promise.resolve({
                    data: success ? updateData : null,
                    error: success ? null : { message: "Failed to update" },
                  })
                },
              }),
            }),
          }

        case "auditor_tasks":
          return {
            select: (columns = "*") => ({
              eq: (column: string, value: any) => ({
                order: (orderColumn: string, options?: any) => ({
                  then: (callback: (result: { data: AuditorTask[] | null; error: any }) => void) => {
                    const data = getMockAuditorTasks(value)
                    callback({ data, error: null })
                    return Promise.resolve({ data, error: null })
                  },
                }),
                single: () => ({
                  then: (callback: (result: { data: AuditorTask | null; error: any }) => void) => {
                    const data = getMockAuditorTask(value)
                    callback({ data, error: null })
                    return Promise.resolve({ data, error: null })
                  },
                }),
              }),
            }),
          }

        case "audit_reports":
          return {
            select: (columns = "*") => ({
              order: (column: string, options?: any) => ({
                then: (callback: (result: { data: AuditReport[] | null; error: any }) => void) => {
                  const data = getMockAuditReports()
                  callback({ data, error: null })
                  return Promise.resolve({ data, error: null })
                },
              }),
            }),
            insert: (data: any) => ({
              then: (callback: (result: { data: any; error: any }) => void) => {
                const success = addMockAuditReport(data)
                callback({ data: success ? data : null, error: success ? null : { message: "Failed to insert" } })
                return Promise.resolve({
                  data: success ? data : null,
                  error: success ? null : { message: "Failed to insert" },
                })
              },
            }),
          }

        default:
          return {
            select: () => ({ then: (cb: any) => cb({ data: [], error: null }) }),
            insert: () => ({ then: (cb: any) => cb({ data: null, error: { message: "Table not found" } }) }),
            update: () => ({ then: (cb: any) => cb({ data: null, error: { message: "Table not found" } }) }),
          }
      }
    },
  }
}

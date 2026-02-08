/**
 * 유지 심사(학업 보고) API 훅
 * - 쿼리: useAcademic.ts
 * - 뮤테이션: useAcademicMutations.ts
 */

export {
  academicKeys,
  useAcademicReports,
  useAcademicReportLookup,
  useAdminAcademicMonitoringYears,
  useAdminAcademicUserReports,
  type AcademicReportsQueryParams,
  type AdminUserReportsQueryParams,
} from './useAcademic'

export {
  useCreateAcademicReport,
  useUpdateAcademicReport,
  useSubmitAcademicReport,
  useAdminEnableAcademicMonitoring,
  useAdminDisableAcademicMonitoring,
} from './useAcademicMutations'

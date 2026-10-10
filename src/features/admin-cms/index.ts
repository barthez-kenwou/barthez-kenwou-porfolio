export {
  dashboardApi,
  getDashboardSummary,
  fetchAdminDashboard,
} from './api/dashboard.api';
export type { AdminDashboardDto } from './api/dashboard.api';
export { filesApi, uploadAdminImage, createPresignedUpload } from './api/files.api';
export type { PresignedUpload } from './api/files.api';
export { useAdminDashboard } from './hooks/useAdminDashboard';
export { useAdminAnalytics } from './hooks/useAdminAnalytics';
export { useAdminAudit } from './hooks/useAdminAudit';
export {
  analyticsApi,
  fetchAnalyticsOverview,
} from './api/analytics.api';
export type {
  AdminAnalyticsOverview,
  AnalyticsPeriod,
} from './api/analytics.api';
export { auditApi, listAuditEntries, getAuditEntry } from './api/audit.api';
export type { AuditEntry, AuditListParams } from './api/audit.api';
export type {
  IContactInfo,
  IContactResponse,
  IProfessionalReference,
  IAdminSkill,
  IAdminCertification,
  IAdminEducation,
  IAdminExperience,
  ContactResponseStatus,
} from './model/cms.types';
export { createId, ensureId } from './lib/id';
export { formatAdminDate } from './lib/formatAdminDate';
export { getReorderTargets, sortBySortOrder } from './lib/reorder';
export type { ReorderDirection, ReorderPatch, SortableItem } from './lib/reorder';
export { useScrollToEditor } from './hooks/useScrollToEditor';
export {
  useUnsavedChangesGuard,
  useDraftDirtyFlag,
} from './hooks/useUnsavedChangesGuard';

export { AdminPageHeader } from './ui/AdminPageHeader.ui';
export type { AdminPageHeaderProps } from './ui/AdminPageHeader.ui';

export { BilingualField } from './ui/BilingualField.ui';
export type { BilingualFieldProps } from './ui/BilingualField.ui';

export { MarkdownEditor } from './ui/MarkdownEditor.ui';
export type { MarkdownEditorProps } from './ui/MarkdownEditor.ui';

export { MermaidEditor } from './ui/MermaidEditor.ui';
export type { MermaidEditorProps } from './ui/MermaidEditor.ui';

export { StringListEditor } from './ui/StringListEditor.ui';
export type { StringListEditorProps } from './ui/StringListEditor.ui';

export { BilingualStringListEditor } from './ui/BilingualStringListEditor.ui';
export type { BilingualStringListEditorProps } from './ui/BilingualStringListEditor.ui';

export { MediaUrlListEditor } from './ui/MediaUrlListEditor.ui';
export type { MediaUrlListEditorProps } from './ui/MediaUrlListEditor.ui';

export { MediaCoverField } from './ui/MediaCoverField.ui';

export { AdminStickyActions } from './ui/AdminStickyActions.ui';

export { KeyValueEditor } from './ui/KeyValueEditor.ui';
export type { KeyValueEditorProps, KeyValueRecord } from './ui/KeyValueEditor.ui';

export { ConfirmDeleteDialog } from './ui/ConfirmDeleteDialog.ui';
export type { ConfirmDeleteDialogProps } from './ui/ConfirmDeleteDialog.ui';

export { AdminDataTable } from './ui/AdminDataTable.ui';
export type {
  AdminDataTableProps,
  AdminDataTableColumn,
  AdminDataTableFilter,
} from './ui/AdminDataTable.ui';

export { AdminEmptyState } from './ui/AdminEmptyState.ui';
export type { AdminEmptyStateProps } from './ui/AdminEmptyState.ui';

export { AdminSectionCard } from './ui/AdminSectionCard.ui';
export type { AdminSectionCardProps } from './ui/AdminSectionCard.ui';

export { Field } from './ui/Field.ui';
export type { FieldProps } from './ui/Field.ui';

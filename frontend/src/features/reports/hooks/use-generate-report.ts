import { useMutation } from '@tanstack/react-query';
import { reportService } from '../services/report.service';
import { showToast } from '@/app/providers/toast-provider';
import { errorMessage } from '@/utils/error-handlers';
import { downloadCsv, downloadJson } from '@/utils/file-helpers';
import { toInputDate } from '@/utils/date-formatter';
import type { ReportRequest } from '../types/report.types';

export type ReportKind =
  | 'income-statement'
  | 'rent-roll'
  | 'arrears-aging'
  | 'occupancy'
  | 'maintenance';

/**
 * Each generator returns a differently-shaped report. The map is typed on the
 * common call signature so `useGenerateReport` can stay generic; callers get
 * the precise shape back via the `TReport` type parameter.
 */
const GENERATORS: Record<ReportKind, (request: ReportRequest) => Promise<unknown>> = {
  'income-statement': reportService.generateIncomeStatement,
  'rent-roll': reportService.generateRentRoll,
  'arrears-aging': reportService.generateArrearsAging,
  occupancy: reportService.generateOccupancy,
  maintenance: reportService.generateMaintenance,
};

/**
 * Generates any of the five reports on demand.
 *
 * Reports are a command, not a cached resource — the same parameters an hour
 * apart should produce fresh figures — so this is a mutation rather than a
 * query.
 */
export const useGenerateReport = <TReport = unknown>(kind: ReportKind) =>
  useMutation<TReport, unknown, ReportRequest>({
    mutationFn: (request: ReportRequest) => GENERATORS[kind](request) as Promise<TReport>,
    onError: (error) => showToast.error('Could not generate the report', errorMessage(error)),
  });

/**
 * Exports an already-generated report.
 *
 * The API returns JSON; converting to CSV happens here so the user gets a
 * file without a second round trip. PDF is not offered — rendering it
 * client-side would need a bundled engine, so print-to-PDF from the report
 * view is the supported route and the report pages are print-styled for it.
 */
export const useExportReport = () => {
  const exportReport = (
    kind: ReportKind,
    report: unknown,
    rows?: Array<Record<string, unknown>>,
    columns?: Array<{ key: string; label: string }>
  ) => {
    const stamp = toInputDate(new Date());
    const filename = `imararent-${kind}-${stamp}`;

    if (rows && columns && rows.length > 0) {
      downloadCsv(`${filename}.csv`, columns, rows);
      showToast.success('Report downloaded');
      return;
    }

    downloadJson(`${filename}.json`, report);
    showToast.success('Report downloaded');
  };

  return { exportReport };
};

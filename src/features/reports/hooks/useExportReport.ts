import { useMutation } from '@tanstack/react-query';

import { exportReport } from '../api/report.api';

import type {
  ExportReportInput,
} from '../types/report.types';

export const useExportReport = () => {
  return useMutation({
    mutationFn: (
      input: ExportReportInput,
    ) => {
      return exportReport(input);
    },
    onSuccess: (response) => {
      if (
        !response.downloadUrl ||
        response.downloadUrl === '#'
      ) {
        return;
      }

      const anchor =
        document.createElement('a');

      anchor.href =
        response.downloadUrl;

      anchor.download =
        response.fileName;

      document.body.appendChild(
        anchor,
      );

      anchor.click();

      document.body.removeChild(
        anchor,
      );

      if (
        response.downloadUrl.startsWith(
          'blob:',
        )
      ) {
        URL.revokeObjectURL(
          response.downloadUrl,
        );
      }
    },
  });
};
export enum SEVERITY {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
};

export type ValidationReportEntry = {
  severity: SEVERITY;
  category: string;
  fileName: string;
  message: string;
}

export type ValidationReport = {
  codespace: string;
  creationDate: string;
  validationReportId: string;
  validationReportEntries: ValidationReportEntry[];
}
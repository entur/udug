import { SEVERITY, ValidationReportEntry } from "../model/ValidationReport";

type GroupedEntry = {
  count: number;
  severity: SEVERITY;
  groupedEntries?: Map<keyof ValidationReportEntry, GroupedEntry>
  entries?: ValidationReportEntry[];
}

export const groupReportEntries = (entries: ValidationReportEntry[], field: keyof ValidationReportEntry, subField?: keyof ValidationReportEntry): Map<keyof ValidationReportEntry, GroupedEntry> => {
  return entries.reduce(
    (entryMap, entry) => entryMap.set(entry[field], {
      count: (entryMap.get(entry[field])?.count || 0) + 1,
      severity: getSeverity(entryMap.get(entry[field])?.severity, entry.severity),
      groupedEntries: subField ? groupReportEntries([...entryMap.get(entry[field])?.entries || [], entry], subField) : undefined,
      entries: [...entryMap.get(entry[field])?.entries || [], entry],
    }),
    new Map())
}

const getSeverity = (current: SEVERITY, next: SEVERITY) => {
  if (current > next) {
    return current
  } else {
    return next;
  }
} 
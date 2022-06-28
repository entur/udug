import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { groupReportEntries } from '../../util/groupReportEntries';
import { useReport } from '../../hooks/useReport';
import { sortBySeverity } from '../../util/sortBySeverity';
import { ExpandableReportRow } from './ExpandableReportRow';
import { Preamble } from './Preamble';
import { NoValidationIssues } from './NoValidationIssues';
import { ReportEntryTable } from './ReportEntryTable';
import { GroupedReportEntriesTable } from './GroupedReportEntriesTable';
import { ReportTable } from './ReportTable';
import { ReportHeading } from './ReportHeading';
import { ReportFetchError } from './ReportFetchError';
import { ReportLoadingIndicator } from './ReportLoadingIndicator';
import './styles.css';

type ReportParams = {
  codespace: string;
  id: string;
};

export const Report = () => {
  const { codespace, id } = useParams<ReportParams>();

  const { report, error } = useReport(codespace!, id!);

  const groupedEntries = useMemo(() => {
    return groupReportEntries(
      report?.validationReportEntries || [],
      'name',
      'fileName',
    );
  }, [report?.validationReportEntries]);

  const sorted = useMemo(() => {
    return Array.from(groupedEntries?.entries() || []).sort((a, b) =>
      sortBySeverity(a[1].severity, b[1].severity),
    );
  }, [groupedEntries]);

  return (
    <div>
      <ReportHeading />
      <ReportFetchError error={error} />
      <ReportLoadingIndicator loading={!report && !error} />
      {report && (
        <>
          <Preamble report={report} />
          {sorted.length === 0 && <NoValidationIssues />}
          {sorted.length > 0 && (
            <ReportTable>
              {sorted.map((entry) => (
                <ExpandableReportRow
                  severity={entry[1].severity}
                  values={[
                    entry[0],
                    entry[1].severity,
                    entry[1].count.toString(),
                  ]}
                  key={`row-${entry[0]}`}
                >
                  <GroupedReportEntriesTable>
                    {Array.from(entry[1]?.groupedEntries || []).map(
                      (subEntry) => (
                        <ExpandableReportRow
                          values={[subEntry[0], subEntry[1].count.toString()]}
                          key={`row-${entry[0]}-${subEntry[0]}`}
                        >
                          <ReportEntryTable subEntry={subEntry} />
                        </ExpandableReportRow>
                      ),
                    )}
                  </GroupedReportEntriesTable>
                </ExpandableReportRow>
              ))}
            </ReportTable>
          )}
        </>
      )}
    </div>
  );
};

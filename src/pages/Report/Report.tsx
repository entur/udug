import { useMemo } from 'react';
import { Loader } from '@entur/loader';
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  HeaderCell,
} from '@entur/table';
import { Heading1 } from '@entur/typography';
import { BannerAlertBox } from '@entur/alert';
import { groupReportEntries } from '../../util/groupReportEntries';
import { useReport } from '../../hooks/useReport';
import { ExpandableReportRow } from './ExpandableReportRow';
import { sortBySeverity } from '../../util/sortBySeverity';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Preamble } from './Preamble';
import { NoValidationIssues } from './NoValidationIssues';
import './styles.scss';

type ReportParams = {
  codespace: string;
  id: string;
};

export const Report = () => {
  const { codespace, id } = useParams<ReportParams>();

  const { report, error } = useReport(codespace!, id!);

  const { formatMessage } = useIntl();

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
      <Heading1>
        {formatMessage({
          id: 'report.heading',
          description: 'Report heading',
          defaultMessage: 'NeTEx validation report',
        })}
      </Heading1>
      {error && (
        <BannerAlertBox
          title={formatMessage({
            id: 'report.fetchError',
            description: 'Error message for error fetching report',
            defaultMessage: 'Error fetching report',
          })}
          variant="error"
        >
          <pre>
            {error.status}: {error.statusText}
          </pre>
        </BannerAlertBox>
      )}
      {!report && !error && <Loader>Loading report</Loader>}
      {report && (
        <>
          <Preamble report={report} />
          {sorted.length === 0 && <NoValidationIssues />}
          {sorted.length > 0 && (
            <Table fixed>
              <TableHead>
                <TableRow>
                  <HeaderCell padding="radio">{''}</HeaderCell>
                  <HeaderCell>Rule name</HeaderCell>
                  <HeaderCell>Severity</HeaderCell>
                  <HeaderCell>Count</HeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
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
                    <div style={{ paddingTop: '0.5rem' }}>
                      <Table spacing="middle">
                        <TableHead>
                          <TableRow>
                            <HeaderCell padding="radio">{''}</HeaderCell>
                            <HeaderCell>File name</HeaderCell>
                            <HeaderCell>Messages</HeaderCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.from(entry[1]?.groupedEntries || []).map(
                            (subEntry) => (
                              <ExpandableReportRow
                                values={[
                                  subEntry[0],
                                  subEntry[1].count.toString(),
                                ]}
                                key={`row-${entry[0]}-${subEntry[0]}`}
                              ></ExpandableReportRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </ExpandableReportRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  );
};

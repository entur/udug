import React, { useMemo } from 'react';
import { Loader } from '@entur/loader';
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  HeaderCell,
  DataCell,
} from '@entur/table';
import { EmphasizedText, Heading1, Paragraph } from '@entur/typography';
import { BannerAlertBox } from '@entur/alert';
import { groupReportEntries } from '../../util/groupReportEntries';
import { useReport } from '../../hooks/useReport';
import { ExpandableReportRow } from './ExpandableReportRow';
import { sortBySeverity } from '../../util/sortBySeverity';
import { useParams } from 'react-router-dom';

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
      <Heading1>NeTEx validation report</Heading1>
      {error && (
        <BannerAlertBox title="Error fetching report" variant="error">
          <pre>
            {error.status}: {error.statusText}
          </pre>
        </BannerAlertBox>
      )}
      {!report && !error && <Loader>Loading report</Loader>}
      {report && (
        <>
          <Paragraph>
            Codespace: <EmphasizedText>{report.codespace}</EmphasizedText>
          </Paragraph>
          <Paragraph>
            Report ID:{' '}
            <EmphasizedText>{report.validationReportId}</EmphasizedText>
          </Paragraph>
          <Paragraph>
            Created:{' '}
            <EmphasizedText>
              {new Date(report.creationDate).toLocaleString()}
            </EmphasizedText>
          </Paragraph>
          {sorted.length === 0 && (
            <BannerAlertBox title="No validation issues" variant="info">
              The validation report contains no issues.
            </BannerAlertBox>
          )}
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
                            >
                              <div
                                style={{
                                  paddingTop: '0.5rem',
                                }}
                              >
                                <Table spacing="small">
                                  <TableHead>
                                    <TableRow>
                                      <HeaderCell
                                        style={{
                                          paddingLeft: '4.5rem',
                                        }}
                                      >
                                        Line
                                      </HeaderCell>
                                      <HeaderCell>Column</HeaderCell>
                                      <HeaderCell>Id</HeaderCell>
                                      <HeaderCell>Message</HeaderCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {subEntry[1].entries?.map(
                                      (messageEntry, messageEntryIndex) => (
                                        <TableRow key={messageEntryIndex}>
                                          <DataCell
                                            style={{
                                              paddingLeft: '4.5rem',
                                            }}
                                          >
                                            {messageEntry.lineNumber}
                                          </DataCell>
                                          <DataCell>
                                            {messageEntry.columnNumber}
                                          </DataCell>
                                          <DataCell>
                                            {messageEntry.objectId}
                                          </DataCell>
                                          <DataCell>
                                            {messageEntry.message}
                                          </DataCell>
                                        </TableRow>
                                      ),
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </ExpandableReportRow>
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

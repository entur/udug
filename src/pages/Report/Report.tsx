import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { Loader } from '@entur/loader';
import { Table, TableHead, TableRow, TableBody, HeaderCell, DataCell, ExpandRowButton, ExpandableRow } from '@entur/table';
import { EmphasizedText, Heading1, Paragraph } from '@entur/typography';
import { BannerAlertBox } from '@entur/alert';
import { match } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react'
import { groupReportEntries } from '../../util/groupReportEntries';
import { ValidationReport, ValidationReportEntry } from '../../model/ValidationReport';

type ReportParams = {
  codespace: string;
  id: string;
}

type ReportProps = {
  match: match<ReportParams>
}

type ValidationReportFetchError = {
  status: number;
  statusText: string;
}

const ExpRow = ({ category, count, severity, children }: { category: string, severity: string, count: number, children: ReactElement}) => {
  const [open, setopen] = React.useState(false)
  return (
    <React.Fragment>
      <TableRow>
        <DataCell>
          <ExpandRowButton onClick={() => setopen(!open)} open={open} />
        </DataCell>
        <DataCell>
          {category}
        </DataCell>
        <DataCell>
          {severity}
        </DataCell>
        <DataCell>
          {count}
        </DataCell>
      </TableRow>
      {/* Tabellen i eksemplet har 3 kolonner, derav colSpan={3} */}
      <ExpandableRow colSpan={5} open={open}>
        {children}
      </ExpandableRow>
    </React.Fragment>
  )
}

const SEVERITY_LEVELS = [
  'INFO',
  'WARNING',
  'ERROR',
];

const sortBySeverity = (a: string, b: string) => {
  return SEVERITY_LEVELS.indexOf(b) - SEVERITY_LEVELS.indexOf(a);
}

export const Report = (props: ReportProps) => {
  const {
    match: {
      params: {
        codespace,
        id
      }
    }
  } = props;

  const {getAccessTokenSilently} = useAuth0();
  const [report, setReport] = useState<ValidationReport | undefined>();
  const [error, setError] = useState<ValidationReportFetchError | undefined>();

  useEffect(() => {
    const fetchReport = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.REACT_APP_TIMETABLE_VALIDATION_API_URL}/${codespace}/${id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}`}
        }
      );
      if (response.ok) {
        const report = await response.json();
        setReport(report);
        setError(undefined);
      } else {
        setError({
          status: response.status,
          statusText: response.statusText 
        });
      }
    }
    fetchReport();
  }, [codespace, id, getAccessTokenSilently]);

  const groupedEntries = useMemo(() => {
    return groupReportEntries(report?.validationReportEntries || [], 'category', 'fileName');
  }, [report?.validationReportEntries]);

  return (
    <div>
      <Heading1>NeTEx validation report</Heading1>
      {error && (
        <BannerAlertBox title="Error fetching report" variant="error">
          <pre>{error.status}: {error.statusText}</pre>
        </BannerAlertBox>
      )}
      {!report && !error && (
        <Loader>Loading report</Loader>
      )}
      {report && (
        <>
          <Paragraph>Codespace: <EmphasizedText>{report.codespace}</EmphasizedText></Paragraph>
          <Paragraph>Report ID: <EmphasizedText>{report.validationReportId}</EmphasizedText></Paragraph>
          <Paragraph>Created: <EmphasizedText>{new Date(report.creationDate).toLocaleString()}</EmphasizedText></Paragraph>
          <Table fixed>
            <TableHead>
              <TableRow>
                <HeaderCell padding="radio">{''}</HeaderCell>
                <HeaderCell>Category</HeaderCell>
                <HeaderCell>Severity</HeaderCell>
                <HeaderCell>Count</HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(groupedEntries?.entries() || []).sort((a, b) => sortBySeverity(a[1].severity, b[1].severity)).map((entry) => (
                <ExpRow category={entry[0]} count={entry[1].count} severity={entry[1].severity} key={entry[0]}>
                  <div style={{ paddingTop: '0.5rem' }}>
                    <Table spacing="middle">
                      <TableHead>
                        <TableRow>
                          <HeaderCell style={{ paddingLeft: '4.5rem' }}>File name</HeaderCell>
                          <HeaderCell>Messages</HeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.from(entry[1]?.groupedEntries || []).map((subEntry, subi) => (
                          <TableRow key={subi}>
                            <DataCell
                              style={{ paddingLeft: '4.5rem' }}
                            >
                              {subEntry[0]}
                            </DataCell>
                            <DataCell>{subEntry[1].count}</DataCell>
                          </TableRow>
                        ))}
                        {entry[1].entries?.sort((a: ValidationReportEntry, b: ValidationReportEntry) => sortBySeverity(a.severity, b.severity)).map((reportEntry: ValidationReportEntry, i: number) => (
                          <TableRow key={i}>
                            <DataCell
                              style={{ paddingLeft: '4.5rem' }}
                            >
                              {reportEntry.severity}
                            </DataCell>
                            <DataCell>{reportEntry.category}</DataCell>
                            <DataCell>{reportEntry.fileName}</DataCell>
                            <DataCell>{reportEntry.message}</DataCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ExpRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
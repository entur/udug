import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { Loader } from '@entur/loader';
import { Table, TableHead, TableRow, TableBody, HeaderCell, DataCell, ExpandRowButton, ExpandableRow } from '@entur/table';
import { EmphasizedText, Heading1, Paragraph } from '@entur/typography';
import { BannerAlertBox } from '@entur/alert';
import { match } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react'

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

type ValidationReportEntry = {
  severity: string;
  category: string;
  fileName: string;
  message: string;
}

type ValidationReport = {
  codespace: string;
  creationDate: string;
  validationReportId: string;
  validationReportEntries: ValidationReportEntry[];
}

const ExpRow = ({ fileName, summary, children }: { fileName: string, summary: Record<string, number>, children: ReactElement}) => {
  const [open, setopen] = React.useState(false)
  return (
    <React.Fragment>
      <TableRow>
        <DataCell>
          <ExpandRowButton onClick={() => setopen(!open)} open={open} />
        </DataCell>
        <DataCell>
          {fileName}
        </DataCell>
        <DataCell>
          {summary['error']}
        </DataCell>
        <DataCell>
          {summary['warning']}
        </DataCell>
        <DataCell>
          {summary['info']}
        </DataCell>
      </TableRow>
      {/* Tabellen i eksemplet har 3 kolonner, derav colSpan={3} */}
      <ExpandableRow colSpan={5} open={open}>
        {children}
      </ExpandableRow>
    </React.Fragment>
  )
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
    return report?.validationReportEntries.reduce(
      (entryMap, entry) => entryMap.set(entry.fileName, {
        summary: {
          error: entry.severity === 'ERROR' ? (entryMap.get(entry.fileName)?.summary?.error || 0) + 1 : (entryMap.get(entry.fileName)?.summary?.error || 0),
          warning: entry.severity === 'WARNING' ? (entryMap.get(entry.fileName)?.summary?.warning || 0) + 1 : (entryMap.get(entry.fileName)?.summary?.warning || 0),
          info: entry.severity === 'INFO' ? (entryMap.get(entry.fileName)?.summary?.info || 0) + 1 : (entryMap.get(entry.fileName)?.summary?.info || 0),
        },
        reportEntries: [...entryMap.get(entry.fileName)?.reportEntries || [], entry],
      }),
    new Map())
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
                <HeaderCell>File name</HeaderCell>
                <HeaderCell>Errors</HeaderCell>
                <HeaderCell>Warnings</HeaderCell>
                <HeaderCell>Info</HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(groupedEntries?.entries() || []).map((entry) => (
                <ExpRow fileName={entry[0]} summary={entry[1].summary} key={entry[0]}>
                  <div style={{ paddingTop: '0.5rem' }}>
                    <Table spacing="middle">
                      <TableHead>
                        <TableRow>
                          <HeaderCell style={{ paddingLeft: '4.5rem' }}>Severity</HeaderCell>
                          <HeaderCell>Category</HeaderCell>
                          <HeaderCell>File name</HeaderCell>
                          <HeaderCell>Message</HeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {entry[1].reportEntries.map((reportEntry: ValidationReportEntry, i: number) => (
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
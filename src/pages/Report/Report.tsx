import React, { useEffect, useState } from 'react';
import { Loader } from '@entur/loader';
import { Table, TableHead, TableRow, TableBody, HeaderCell, DataCell } from '@entur/table';
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
      console.log(response);
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
          <Table>
            <TableHead>
              <TableRow>
                <HeaderCell>Severity</HeaderCell>
                <HeaderCell>Category</HeaderCell>
                <HeaderCell>File name</HeaderCell>
                <HeaderCell>Message</HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.validationReportEntries.map((entry, i) => (
                <TableRow key={i}>
                  <DataCell
                    status={entry.severity === 'ERROR' ? 'negative' : 'neutral'}
                  >
                    {entry.severity}
                  </DataCell>
                  <DataCell>{entry.category}</DataCell>
                  <DataCell>{entry.fileName}</DataCell>
                  <DataCell>{entry.message}</DataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
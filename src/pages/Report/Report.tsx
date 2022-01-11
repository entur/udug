import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { Loader } from '@entur/loader'
import {
    Table,
    TableHead,
    TableRow,
    TableBody,
    HeaderCell,
    DataCell,
    ExpandRowButton,
    ExpandableRow,
} from '@entur/table'
import { EmphasizedText, Heading1, Paragraph } from '@entur/typography'
import { BannerAlertBox } from '@entur/alert'
import { match } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { groupReportEntries } from '../../util/groupReportEntries'
import {
    ValidationReport,
} from '../../model/ValidationReport'

type ReportParams = {
    codespace: string
    id: string
}

type ReportProps = {
    match: match<ReportParams>
}

type ValidationReportFetchError = {
    status: number
    statusText: string
}

const ExpRow = ({
    values,
    children,
}: {
    values: string[],
    children: ReactElement
}) => {
    const [open, setopen] = React.useState(false)
    return (
        <React.Fragment>
            <TableRow>
                <DataCell>
                    <ExpandRowButton
                        onClick={() => setopen(!open)}
                        open={open}
                    />
                </DataCell>
                {values.map(value => (
                  <DataCell>{value}</DataCell>
                ))}
            </TableRow>
            <ExpandableRow colSpan={values.length + 1} open={open}>
                {children}
            </ExpandableRow>
        </React.Fragment>
    )
}

const SEVERITY_LEVELS = ['INFO', 'WARNING', 'ERROR']

const sortBySeverity = (a: string, b: string) => {
    return SEVERITY_LEVELS.indexOf(b) - SEVERITY_LEVELS.indexOf(a)
}

export const Report = (props: ReportProps) => {
    const {
        match: {
            params: { codespace, id },
        },
    } = props

    const { getAccessTokenSilently } = useAuth0()
    const [report, setReport] = useState<ValidationReport | undefined>()
    const [error, setError] = useState<ValidationReportFetchError | undefined>()

    useEffect(() => {
        const fetchReport = async () => {
            const accessToken = await getAccessTokenSilently()
            const response = await fetch(
                `${process.env.REACT_APP_TIMETABLE_VALIDATION_API_URL}/${codespace}/${id}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            )
            if (response.ok) {
                const report = await response.json()
                setReport(report)
                setError(undefined)
            } else {
                setError({
                    status: response.status,
                    statusText: response.statusText,
                })
            }
        }
        fetchReport()
    }, [codespace, id, getAccessTokenSilently])

    const groupedEntries = useMemo(() => {
        return groupReportEntries(
            report?.validationReportEntries || [],
            'name',
            'fileName',
        )
    }, [report?.validationReportEntries])

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
                        Codespace:{' '}
                        <EmphasizedText>{report.codespace}</EmphasizedText>
                    </Paragraph>
                    <Paragraph>
                        Report ID:{' '}
                        <EmphasizedText>
                            {report.validationReportId}
                        </EmphasizedText>
                    </Paragraph>
                    <Paragraph>
                        Created:{' '}
                        <EmphasizedText>
                            {new Date(report.creationDate).toLocaleString()}
                        </EmphasizedText>
                    </Paragraph>
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
                            {Array.from(groupedEntries?.entries() || [])
                                .sort((a, b) =>
                                    sortBySeverity(
                                        a[1].severity,
                                        b[1].severity,
                                    ),
                                )
                                .map((entry) => (
                                    <ExpRow
                                        values={[entry[0], entry[1].severity, entry[1].count.toString()]}
                                        key={entry[0]}
                                    >
                                        <div style={{ paddingTop: '0.5rem' }}>
                                            <Table spacing="middle">
                                                <TableHead>
                                                    <TableRow>
                                                        <HeaderCell padding="radio">{''}</HeaderCell>
                                                        <HeaderCell>
                                                            File name
                                                        </HeaderCell>
                                                        <HeaderCell>
                                                            Messages
                                                        </HeaderCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Array.from(
                                                        entry[1]
                                                            ?.groupedEntries ||
                                                            [],
                                                    ).map((subEntry) => (
                                                        <ExpRow
                                                          values={[subEntry[0], subEntry[1].count.toString()]}
                                                          key={subEntry[0]}
                                                        >
                                                          <div style={{ paddingTop: '0.5rem'}}>
                                                            <Table spacing="small">
                                                              <TableHead>
                                                                <TableRow>
                                                                  <HeaderCell
                                                                    style={{
                                                                      paddingLeft: '4.5rem'
                                                                    }}
                                                                  >
                                                                    Message
                                                                  </HeaderCell>
                                                                </TableRow>
                                                              </TableHead>
                                                              <TableBody>
                                                                {subEntry[1].entries?.map((messageEntry, messageEntryIndex) => (
                                                                  <TableRow
                                                                    key={messageEntryIndex}
                                                                  >
                                                                    <DataCell style={{
                                                                      paddingLeft: '4.5rem'
                                                                    }}>
                                                                      {messageEntry.message}
                                                                    </DataCell>
                                                                  </TableRow>
                                                                ))}
                                                              </TableBody>
                                                            </Table>
                                                          </div>
                                                        </ExpRow>
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
    )
}

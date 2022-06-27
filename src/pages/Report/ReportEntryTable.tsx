import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { useIntl } from 'react-intl';
import { ValidationReportEntry } from '../../model/ValidationReport';
import { GroupedEntry } from '../../util/groupReportEntries';

export const ReportEntryTable = ({
  subEntry,
}: {
  subEntry: [keyof ValidationReportEntry, GroupedEntry];
}) => {
  const { formatMessage } = useIntl();
  return (
    <div className="report_entry_table-wrapper">
      <Table spacing="small">
        <TableHead>
          <TableRow>
            <HeaderCell className="report_entry_table-first_column">
              Line
            </HeaderCell>
            <HeaderCell>
              {formatMessage({
                id: 'reportEntryTable.columnHeaderLabel',
                description: 'Label for column header',
                defaultMessage: 'Column',
              })}
            </HeaderCell>
            <HeaderCell>
              {formatMessage({
                id: 'reportEntryTable.idHeaderLabel',
                description: 'Label for ID header',
                defaultMessage: 'Id',
              })}
            </HeaderCell>
            <HeaderCell>
              {formatMessage({
                id: 'reportEntryTable.messageHeaderLabel',
                description: 'Label for message header',
                defaultMessage: 'Message',
              })}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subEntry[1].entries?.map((messageEntry, messageEntryIndex) => (
            <TableRow key={messageEntryIndex}>
              <DataCell className="report_entry_table-first_column">
                {messageEntry.lineNumber}
              </DataCell>
              <DataCell>{messageEntry.columnNumber}</DataCell>
              <DataCell>{messageEntry.objectId}</DataCell>
              <DataCell>{messageEntry.message}</DataCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

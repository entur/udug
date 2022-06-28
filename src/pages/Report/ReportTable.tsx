import {
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { ReactNode } from 'react';
import { useIntl } from 'react-intl';

export const ReportTable = ({ children }: { children: ReactNode }) => {
  const { formatMessage } = useIntl();
  return (
    <Table fixed>
      <TableHead>
        <TableRow>
          <HeaderCell padding="radio">{''}</HeaderCell>
          <HeaderCell>
            {formatMessage({
              id: 'reportTable.ruleNameColumnHeader',
              description: 'Column header for rule name',
              defaultMessage: 'Rule name',
            })}
          </HeaderCell>
          <HeaderCell>
            {formatMessage({
              id: 'reportTable.severityColumnHeader',
              description: 'Column header for severity',
              defaultMessage: 'Severity',
            })}
          </HeaderCell>
          <HeaderCell>
            {formatMessage({
              id: 'reportTable.countColumnHeader',
              description: 'Column header for violations count',
              defaultMessage: 'Count',
            })}
          </HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>{children}</TableBody>
    </Table>
  );
};

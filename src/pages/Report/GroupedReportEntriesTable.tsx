import {
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { ReactNode } from 'react';
import { useIntl } from 'react-intl';

export const GroupedReportEntriesTable = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { formatMessage } = useIntl();
  return (
    <div style={{ paddingTop: '0.5rem' }}>
      <Table spacing="middle">
        <TableHead>
          <TableRow>
            <HeaderCell padding="radio">{''}</HeaderCell>
            <HeaderCell>
              {formatMessage({
                id: 'groupedReportEntries.fileNameHeaderLabel',
                description: 'Header label for file name column',
                defaultMessage: 'File name',
              })}
            </HeaderCell>
            <HeaderCell>
              {formatMessage({
                id: 'groupedReportEntries.messagesHeaderLabel',
                description: 'Header label for messages column',
                defaultMessage: 'Messages',
              })}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
};

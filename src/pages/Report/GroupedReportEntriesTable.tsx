import {
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { ReactNode } from 'react';

export const GroupedReportEntriesTable = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div style={{ paddingTop: '0.5rem' }}>
      <Table spacing="middle">
        <TableHead>
          <TableRow>
            <HeaderCell padding="radio">{''}</HeaderCell>
            <HeaderCell>File name</HeaderCell>
            <HeaderCell>Messages</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
};

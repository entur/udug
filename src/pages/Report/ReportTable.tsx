import {
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { ReactNode } from 'react';

export const ReportTable = ({ children }: { children: ReactNode }) => {
  return (
    <Table fixed>
      <TableHead>
        <TableRow>
          <HeaderCell padding="radio">{''}</HeaderCell>
          <HeaderCell>Rule name</HeaderCell>
          <HeaderCell>Severity</HeaderCell>
          <HeaderCell>Count</HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>{children}</TableBody>
    </Table>
  );
};

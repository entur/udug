import {
  DataCell,
  ExpandableRow,
  ExpandRowButton,
  TableRow,
} from '@entur/table';
import React, { ReactElement } from 'react';

export const ExpandableReportRow = ({
  values,
  children,
}: {
  values: string[];
  children: ReactElement;
}) => {
  const [open, setopen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow>
        <DataCell>
          <ExpandRowButton onClick={() => setopen(!open)} open={open} />
        </DataCell>
        {values.map((value, i) => (
          <DataCell key={`${i}-${value}`}>{value}</DataCell>
        ))}
      </TableRow>
      <ExpandableRow colSpan={values.length + 1} open={open}>
        {open && children}
      </ExpandableRow>
    </React.Fragment>
  );
};

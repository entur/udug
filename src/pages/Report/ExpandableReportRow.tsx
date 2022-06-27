import {
  DataCell,
  ExpandableRow,
  ExpandRowButton,
  TableRow,
} from '@entur/table';
import React, { ReactElement } from 'react';
import { SEVERITY } from '../../model/ValidationReport';

export const ExpandableReportRow = ({
  values,
  children,
  severity,
}: {
  values: string[];
  children: ReactElement;
  severity?: SEVERITY;
}) => {
  const [open, setopen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        onClick={() => setopen(!open)}
        className="expandable_report_row"
        style={{
          backgroundColor:
            severity === SEVERITY.CRITICAL ? '#ffcece' : 'transparent',
        }}
      >
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

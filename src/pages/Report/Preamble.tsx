import { EmphasizedText, Paragraph } from '@entur/typography';
import { useIntl } from 'react-intl';
import { ValidationReport } from '../../model/ValidationReport';

export const Preamble = ({ report }: { report: ValidationReport }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <Paragraph>
        {formatMessage({
          id: 'report.preamble.codespaceLabel',
          description: 'Label for codespace in report preamble',
          defaultMessage: 'Codespace',
        })}
        : <EmphasizedText>{report.codespace}</EmphasizedText>
      </Paragraph>
      <Paragraph>
        {formatMessage({
          id: 'report.preamble.reportIdLabel',
          description: 'Label for report ID in report preamble',
          defaultMessage: 'Report ID',
        })}
        : <EmphasizedText>{report.validationReportId}</EmphasizedText>
      </Paragraph>
      <Paragraph>
        {formatMessage({
          id: 'report.preamble.createdLabel',
          description: 'Label for creation date in report preamble',
          defaultMessage: 'Created',
        })}
        :{' '}
        <EmphasizedText>
          {new Date(report.creationDate).toLocaleString()}
        </EmphasizedText>
      </Paragraph>
    </>
  );
};

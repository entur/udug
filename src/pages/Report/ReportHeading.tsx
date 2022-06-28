import { Heading1 } from '@entur/typography';
import { useIntl } from 'react-intl';

export const ReportHeading = () => {
  const { formatMessage } = useIntl();
  return (
    <Heading1>
      {formatMessage({
        id: 'report.heading',
        description: 'Report heading',
        defaultMessage: 'NeTEx validation report',
      })}
    </Heading1>
  );
};

import { BannerAlertBox } from '@entur/alert';
import { useIntl } from 'react-intl';
import { ValidationReportFetchError } from '../../hooks/useReport';

export const ReportFetchError = ({
  error,
}: {
  error?: ValidationReportFetchError;
}) => {
  const { formatMessage } = useIntl();
  return (
    (error && (
      <BannerAlertBox
        title={formatMessage({
          id: 'report.fetchError',
          description: 'Error message for error fetching report',
          defaultMessage: 'Error fetching report',
        })}
        variant="error"
      >
        <pre>
          {error?.status}: {error?.statusText}
        </pre>
      </BannerAlertBox>
    )) ||
    null
  );
};

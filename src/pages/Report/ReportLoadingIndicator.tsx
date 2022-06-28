import { Loader } from '@entur/loader';
import { useIntl } from 'react-intl';

export const ReportLoadingIndicator = ({ loading }: { loading: boolean }) => {
  const { formatMessage } = useIntl();
  return (
    (loading && (
      <Loader>
        {formatMessage({
          id: 'reportLoadingIndicator.message',
          description: 'Message to show while loading report',
          defaultMessage: 'Loading report',
        })}
      </Loader>
    )) ||
    null
  );
};

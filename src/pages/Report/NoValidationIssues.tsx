import { BannerAlertBox } from '@entur/alert';
import { useIntl } from 'react-intl';

export const NoValidationIssues = () => {
  const { formatMessage } = useIntl();
  return (
    <BannerAlertBox
      title={formatMessage({
        id: 'report.noValidationIssuesBanner.title',
        description: 'Title for no validation issues banner',
        defaultMessage: 'No validation issues',
      })}
      variant="info"
    >
      {formatMessage({
        id: 'report.noValidationIssuesBanner.text',
        description: 'Text for no validation issues banner',
        defaultMessage: 'The validation report contains no issues.',
      })}
    </BannerAlertBox>
  );
};

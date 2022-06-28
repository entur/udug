import { Loader } from '@entur/loader';

export const ReportLoadingIndicator = ({ loading }: { loading: boolean }) => {
  return (loading && <Loader>Loading report</Loader>) || null;
};

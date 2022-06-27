import { useEffect, useState } from 'react';
import { useAuth } from '../AppProvider';
import { useConfig } from '../config/config';
import { ValidationReport } from '../model/ValidationReport';

type ValidationReportFetchError = {
  status: number;
  statusText: string;
};

export const useReport = (codespace: string, id: string) => {
  const { getToken } = useAuth();
  const config = useConfig();
  const [report, setReport] = useState<ValidationReport | undefined>();
  const [error, setError] = useState<ValidationReportFetchError | undefined>();

  useEffect(() => {
    const fetchReport = async () => {
      const accessToken = getToken ? await getToken() : '';
      const response = await fetch(
        `${config.timetableValidationApiUrl}/${codespace}/${id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (response.ok) {
        const report = await response.json();
        setReport(report);
        setError(undefined);
      } else {
        setError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    };
    fetchReport();
  }, [codespace, id, getToken]);

  return { report, error };
};

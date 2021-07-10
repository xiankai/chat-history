import { ChatLogFormat } from 'datasources/base';

export const CSVExport = ({
  logs,
  recipient,
  date,
}: {
  recipient: string;
  date: string;
  logs: ChatLogFormat[];
}) => (
  <div
    style={{
      whiteSpace: 'pre-line',
      textAlign: 'left',
    }}
  >
    {logs
      .map((log) =>
        [
          log[0],
          new Date(log[1]).getTime(),
          log[2].replace('"', '\\"'),
          log[3],
          log[4].sender,
          recipient,
          '2008-12-22',
        ]
          .map((l) => '`' + l + '`')
          .join(',')
      )
      .join('\n')}
  </div>
);

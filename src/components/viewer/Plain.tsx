import { ChatLogFormat } from 'datasources/base';

export const Plain = ({ logs }: { logs: ChatLogFormat[] }) => (
  <div
    style={{
      whiteSpace: 'pre-line',
      textAlign: 'left',
    }}
  >
    {logs.map((log) => log.join(',')).join('\n')}
  </div>
);

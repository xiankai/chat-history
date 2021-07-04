export const Plain = ({ logs }) => (
  <div
    style={{
      whiteSpace: 'pre-line',
      textAlign: 'left',
    }}
  >
    {logs.map((log) => log.join(',')).join('\n')}
  </div>
);

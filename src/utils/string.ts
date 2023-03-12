// Problem: https://stackoverflow.com/a/50011987/1097483
// Solution in JS: https://stackoverflow.com/a/5396742/1097483
export const fixMessengerExport = (message: string) => {
  return decodeURIComponent(escape(message));
};

export const formatDurationFromSeconds = (seconds: number) =>
  new Date(1000 * seconds).toISOString().substring(11, 19);

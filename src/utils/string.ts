// Problem: https://stackoverflow.com/a/50011987/1097483
// Solution in JS: https://stackoverflow.com/a/5396742/1097483
export const fixMessengerExport = (message: string) => {
  return decodeURIComponent(escape(message));
};

// https://stackoverflow.com/a/16348977/1097483
export const stringToColor = (str: string) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

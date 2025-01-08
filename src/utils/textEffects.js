const scrambleText = (finalText, progress) => {
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < finalText.length; i++) {
    if (i < progress) {
      result += finalText[i];
    } else {
      result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  }
  return result;
};

export { scrambleText }; 
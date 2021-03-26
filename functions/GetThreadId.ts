export default function GetThreadId(x, y) {
  let messageThreadId = "";
  if (x > y)
    messageThreadId = y.concat(x);
  else
    messageThreadId = x.concat(y);

  return messageThreadId;
}

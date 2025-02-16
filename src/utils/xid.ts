function getYYYYMMDDHHMMSS(): string {
  let date: Date = new Date();
  let timestamp: number = date.getTime();

  // 将时间戳调整为最接近的能被 4 整除的数
  if (timestamp % 4 !== 0) {
    const remainder: number = timestamp % 4;
    timestamp =
      remainder <= 2 ? timestamp - remainder : timestamp + 4 - remainder;
    date.setTime(timestamp); // 更新 Date 对象
  }

  let formattedDate: string = date.getFullYear().toString();
  formattedDate += String(date.getMonth() + 1).padStart(2, "0");
  formattedDate += String(date.getDate()).padStart(2, "0");
  formattedDate += String(date.getHours()).padStart(2, "0");
  formattedDate += String(date.getMinutes()).padStart(2, "0");
  formattedDate += String(date.getSeconds()).padStart(2, "0");

  // 检查 YYYYMMDDHHMMSS 是否能被 4 整除，否则调整
  let dateNumber: number = parseInt(formattedDate, 10);
  if (dateNumber % 4 !== 0) {
    const remainder: number = dateNumber % 4;
    dateNumber =
      remainder <= 2 ? dateNumber - remainder : dateNumber + 4 - remainder;
    formattedDate = dateNumber.toString();
  }

  return formattedDate;
}

const START_YEAR: number = 1997;
const KEY: string[] = "0123456789ABCDFEGHIJKLMNOPQRSTUVWXYZ".split("");

function num2key(n: number): string[] {
  const res: string[] = [];
  let num: number = parseInt(n.toString()); // Ensure n is a number
  if (n <= 0) return [];
  const klen: number = KEY.length;
  while (num > 0) {
    const v: number = num % klen;
    num = (num - v) / klen;
    const k: string = KEY[v];
    res.push(k);
  }
  return res.reverse();
}

function key2num(keys: string): number {
  let num: number = 0;
  let mult: number = 1;
  const klen: number = KEY.length;
  for (let i: number = keys.length - 1; i >= 0; i -= 1) {
    num += mult * KEY.indexOf(keys[i]);
    mult *= klen;
  }
  return num;
}

function padStart(
  s: string | number,
  targetLength: number,
  padString: string
): string {
  s = String(s);
  while (s.length < targetLength) {
    s = padString + s;
  }
  return s;
}

function padEnd(
  s: string | number,
  targetLength: number,
  padString: string
): string {
  s = String(s);
  while (s.length < targetLength) {
    s = s + padString;
  }
  return s;
}

function date2Rtime(datetime: string): string {
  const s: string = datetime.toString();
  const simpleYear: number = parseInt(s.slice(0, 4)) - START_YEAR;
  const month: number = parseInt(s.slice(4, 6));
  const date: number = parseInt(s.slice(6, 8));
  const hour: number = parseInt(s.slice(8, 10));
  const minute: number = parseInt(s.slice(10, 12));
  const second: number = Math.floor(parseInt(s.slice(12, 14)) / 4);

  const yearMonthRtime: number = (simpleYear << 4) | month;
  const hmsRtime: number = (hour << 10) | (minute << 4) | second;

  let rtimeKey: string =
    num2key(yearMonthRtime).join("") +
    num2key(date).join("") +
    num2key(hmsRtime).join("");
  rtimeKey = padEnd(rtimeKey, 6, "0");
  return rtimeKey;
}

function rtime2Date(rtimeKey: string): string {
  const hmsRtime: number = key2num(rtimeKey.slice(3, 6));
  const yearMonthRtime: number = key2num(rtimeKey.slice(0, 2));
  const date: string = String(key2num(rtimeKey.slice(2, 3)));

  const year: number = (yearMonthRtime >> 4) + START_YEAR;
  const month: string = String(yearMonthRtime & 0b1111);
  const hour: number = hmsRtime >> 10;
  const minute: number = (hmsRtime >> 4) & 0b111111;
  const second: number = 4 * (hmsRtime & 0b1111);
  const datetime: string =
    year +
    padStart(month, 2, "0") +
    padStart(date, 2, "0") +
    padStart(hour, 2, "0") +
    padStart(minute, 2, "0") +
    padStart(second, 2, "0");
  return datetime;
}

export function getXID(): string {
  const time: string = getYYYYMMDDHHMMSS();
  return date2Rtime(time);
}

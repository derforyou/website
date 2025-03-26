export function fromUnix(unix: number) {
  return new Date(unix * 1000);
}

export function toUnix(date: Date | string) {
  if (
    typeof date === "string" &&
    /^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}:\d{2}$/.test(date)
  ) {
    return fromDateTimeString(date);
  }

  let dateObj: Date | undefined;
  if (typeof date === "string") {
    dateObj = new Date(date);
  }

  return Math.floor((dateObj || new Date(date)).getTime() / 1000);
}

function fromDateTimeString(dateTimeString: string) {
  const [date, time] = dateTimeString.split(", ");
  const [day, month, year] = date.split(".").map(Number);
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const dateObj = new Date(year, month - 1, day, hours, minutes, seconds);
  return Math.floor(dateObj.getTime() / 1000);
}

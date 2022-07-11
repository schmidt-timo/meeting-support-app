import { v4 as uuidv4 } from "uuid";

export function getNameInitials(name: string) {
  const nameParts = name.split(" ");
  var result = nameParts[0].substring(0, 1).toUpperCase();
  if (nameParts.length > 1) {
    result += nameParts[nameParts.length - 1].substring(0, 1).toUpperCase();
  }
  return result;
}

export function generateRandomID() {
  return uuidv4();
}

export function convertStringsToDate(date: string, time: string) {
  return new Date(`${date}T${time}`);
}

export function dateAsStringIsTodayOrLater(dateString: string) {
  return Date.parse(dateString) >= Date.parse(new Date().toDateString());
}

export function objectsAreEqual(obj1: any, obj2: any) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function arraysAreEqual(arr1: any[], arr2: any[]) {
  if (arr1 === arr2) {
    return true;
  }
  if (arr1 == null || arr2 == null) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  return true;
}

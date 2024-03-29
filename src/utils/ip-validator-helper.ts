import { isNilOrEmpty } from "./utils";

const emptyAddresses = ['0.0.0.0', 'any', ''];
const firstByteIpv6Regex = new RegExp('^([0-9a-fA-F]{1,4}:)');


export const ipv4Regex = new RegExp(
  '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]{1,5})?$',
);
export const ipv6Regex = new RegExp(
  /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$/,
);

// RFC 1123
//FIXME check for invalid 1.1.1.1.1
export const hostnameRegex =
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;

/*
 * Source: https://www.regextester.com/97579
 */
export const netmaskRegex =
  /^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/;

/*
 * Source: https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch08s15.html
 */
export const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;

export const isEmptyIp = (address?: string): boolean =>
  address == null ||
  !isNilOrEmpty(emptyAddresses.filter((emptyAddress) => address?.toLowerCase() === emptyAddress));

export const isMulticast = (address?: string): boolean => {
  if (address == null) return false;

  if (ipv4Regex.test(address)) {
    // IPv4
    const firstBytesRegexp = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.');
    const firstBytesString = firstBytesRegexp.exec(address);
    if (firstBytesString) {
      const firstBytes = parseInt(firstBytesString[1], 10);
      if ((firstBytes & 0xf0) === 0xe0) {
        return true; // is IPv4 multicast
      }
    }
  }

  if (ipv6Regex.test(address)) {
    // IPv6
    const firstBytesString = firstByteIpv6Regex.exec(address);
    if (firstBytesString) {
      const firstBytes = parseInt(firstBytesString[1], 16);
      if ((firstBytes & 0xff00) === 0xff00) {
        return true; // is IPv6 multicast
      }
    }
  }

  return false;
};

export const isDnsOrEmpty = (address?: string): boolean => {
  if (address == null) return false;
  if (isEmptyIp(address)) {
    return true;
  }
  return (ipv4Regex.test(address) || ipv6Regex.test(address)) && !isMulticast(address);
};

export const isIpv4OrEmpty = (address?: string): boolean => {
  if (address == null) return false;
  if (isEmptyIp(address)) {
    return true;
  }
  return ipv4Regex.test(address);
};

export const isIpOrHostname = (address?: string): boolean =>
  address !== undefined &&
  (ipv4Regex.test(address) || ipv6Regex.test(address) || hostnameRegex.test(address));

export const isIpOrHostnameOrEmpty = (address?: string): boolean =>
  isEmptyIp(address) || isIpOrHostname(address);

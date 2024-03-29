import {
  isDnsOrEmpty,
  isEmptyIp,
  isIpOrHostname,
  isIpOrHostnameOrEmpty,
  isIpv4OrEmpty,
  isMulticast,
} from 'src/js/validator/ip-validator-helper';

describe('isMulticast', () => {
  test('should return false on Any', () => {
    expect(isMulticast('Any')).toBeFalsy();
  });

  test('should return false on 0.0.0.0', () => {
    expect(isMulticast('0.0.0.0')).toBeFalsy();
  });

  test('should return false on empty string', () => {
    expect(isMulticast('')).toBeFalsy();
  });

  test('should return false on IPv4 unicast', () => {
    expect(isMulticast('192.168.0.1')).toBeFalsy();
  });

  test('should return true on IPv4 multicast', () => {
    expect(isMulticast('235.5.0.24')).toBeTruthy();
  });

  test('should return false on IPv4 multicast with garbage in front', () => {
    expect(isMulticast('2222235.5.0.24')).toBeFalsy();
  });

  test('should return false on IPv6 unicast', () => {
    expect(isMulticast('fd00:10:65:10:80b3:22cf:4036:5329')).toBeFalsy();
  });

  test('should return true on IPv6 multicast short writing', () => {
    expect(isMulticast('ff02::3')).toBeTruthy();
  });

  test('should return true on IPv6 multicast long writing', () => {
    expect(isMulticast('ff04:0000:0000:0000:0000:0000:0000:0001')).toBeTruthy();
  });
});

describe('isDnsOrEmpty', () => {
  test('should return true on Any', () => {
    expect(isDnsOrEmpty('Any')).toBeTruthy();
  });

  test('should return true on 0.0.0.0', () => {
    expect(isDnsOrEmpty('0.0.0.0')).toBeTruthy();
  });

  test('should return true on empty string', () => {
    expect(isDnsOrEmpty('')).toBeTruthy();
  });

  test('should return true on IPv4 unicast', () => {
    expect(isDnsOrEmpty('192.168.0.1')).toBeTruthy();
    expect(isDnsOrEmpty('8.8.8.8')).toBeTruthy();
    expect(isDnsOrEmpty('8.8.4.4')).toBeTruthy();
    expect(isDnsOrEmpty('1.0.0.0')).toBeTruthy();
  });

  test('should return false on IPv4 multicast', () => {
    expect(isDnsOrEmpty('235.5.0.24')).toBeFalsy();
    expect(isDnsOrEmpty('225.1.1.1')).toBeFalsy();
  });

  test('should return true on IPv6 unicast', () => {
    expect(isDnsOrEmpty('fd00:10:65:10:80b3:22cf:4036:5329')).toBeTruthy();
  });

  test('should return false on IPv6 multicast short writing', () => {
    expect(isDnsOrEmpty('ff02::3')).toBeFalsy();
  });

  test('should return false on IPv6 multicast long writing', () => {
    expect(isDnsOrEmpty('ff04:0000:0000:0000:0000:0000:0000:0001')).toBeFalsy();
  });

  test('should return false on bad inputs', () => {
    expect(isDnsOrEmpty('google.com')).toBeFalsy();
    expect(isDnsOrEmpty('bleh')).toBeFalsy();
    expect(isDnsOrEmpty('test dns')).toBeFalsy();
    expect(isDnsOrEmpty('1.0.0.0.0')).toBeFalsy();
    expect(isDnsOrEmpty('1.0.0')).toBeFalsy();
  });
});

describe('isEmptyIp', () => {
  test('should return true on empty ips', () => {
    expect(isEmptyIp('Any')).toBeTruthy();
    expect(isEmptyIp('any')).toBeTruthy();
    expect(isEmptyIp('aNY')).toBeTruthy();
    expect(isEmptyIp('0.0.0.0')).toBeTruthy();
    expect(isEmptyIp('')).toBeTruthy();
    expect(isEmptyIp(undefined)).toBeTruthy();
  });

  test('should return false with a real ip', () => {
    expect(isEmptyIp('1.2.3.4')).toBeFalsy();
    expect(isEmptyIp('10.10.10.10')).toBeFalsy();
  });
});

describe('isIpv4OrEmpty', () => {
  test('should return true on empty ips', () => {
    expect(isIpv4OrEmpty('Any')).toBeTruthy();
    expect(isIpv4OrEmpty('any')).toBeTruthy();
    expect(isIpv4OrEmpty('aNY')).toBeTruthy();
    expect(isIpv4OrEmpty('0.0.0.0')).toBeTruthy();
    expect(isIpv4OrEmpty('')).toBeTruthy();
    expect(isIpv4OrEmpty(undefined)).toBeTruthy();
  });

  test('should return true with a IPv4', () => {
    expect(isIpv4OrEmpty('1.2.3.4')).toBeTruthy();
    expect(isIpv4OrEmpty('10.10.10.10')).toBeTruthy();
  });

  test('should return false on IPv6 ', () => {
    expect(isIpv4OrEmpty('fd00:10:65:10:80b3:22cf:4036:5329')).toBeFalsy();
    expect(isIpv4OrEmpty('ff02::3')).toBeFalsy();
    expect(isIpv4OrEmpty('ff04:0000:0000:0000:0000:0000:0000:0001')).toBeFalsy();
  });
});

describe('isIpOrHostname', () => {
  test('should return true on empty ips', () => {
    expect(isIpOrHostname('Any')).toBeTruthy();
    expect(isIpOrHostname('any')).toBeTruthy();
    expect(isIpOrHostname('aNY')).toBeTruthy();
    expect(isIpOrHostname('0.0.0.0')).toBeTruthy();
    expect(isIpOrHostname('1.0.0.0.1')).toBeTruthy(); // yeah, it is a valid hostname unfortunately
    expect(isIpOrHostname('')).toBeFalsy();
    expect(isIpOrHostname(undefined)).toBeFalsy();
  });
});

describe('isIpOrHostnameOrEmpty', () => {
  test('should return true on empty ips', () => {
    expect(isIpOrHostnameOrEmpty('Any')).toBeTruthy();
    expect(isIpOrHostnameOrEmpty('any')).toBeTruthy();
    expect(isIpOrHostnameOrEmpty('aNY')).toBeTruthy();
    expect(isIpOrHostnameOrEmpty('0.0.0.0')).toBeTruthy();
    expect(isIpOrHostnameOrEmpty('')).toBeTruthy();
    expect(isIpOrHostnameOrEmpty(undefined)).toBeTruthy();
  });

  test('should return true with a IPv4', () => {
    expect(isIpOrHostnameOrEmpty('1.2.3.4')).toBeTruthy();
    expect(isIpOrHostnameOrEmpty('10.10.10.10')).toBeTruthy();
  });

  test('should return true on IPv6 ', () => {
    expect(isIpOrHostnameOrEmpty('fd00:10:65:10:80b3:22cf:4036:5329')).toBeTruthy();
    expect(isIpOrHostnameOrEmpty('ff02::3')).toBeTruthy();
    expect(isIpOrHostnameOrEmpty('ff04:0000:0000:0000:0000:0000:0000:0001')).toBeTruthy();
  });

  test('should return true on a domain', () => {
    expect(isIpOrHostnameOrEmpty('test.com')).toBeTruthy();
    expect(isIpOrHostnameOrEmpty('haivision.test.com')).toBeTruthy();
    expect(isIpOrHostnameOrEmpty('test.test')).toBeTruthy();
  });

  test('should return false on everything else', () => {
    expect(isIpOrHostnameOrEmpty('test  test')).toBeFalsy();
    expect(isIpOrHostnameOrEmpty('test..c')).toBeFalsy();
    expect(isIpOrHostnameOrEmpty('300...300...300.300')).toBeFalsy();
  });
});

import { FormikProps } from 'formik';
import { TFunction } from 'i18next';

import {
  domainRegex,
  ipv4Regex,
  ipv6Regex,
  isDnsOrEmpty,
  isIpOrHostname,
  isIpOrHostnameOrEmpty,
  isMulticast,
  netmaskRegex,
} from 'src/utils/ip-validator-helper';
import { isAutoAssignOrNumber } from 'src/utils/port-validator-helper';
import * as yup from 'yup';

import { Config } from '../config';

export const ipv4 = (t: TFunction) => yup.string().matches(ipv4Regex, t('validation.network.ipv4'));

export const ipOrHostnameOrEmpty = (t: TFunction) =>
  yup
    .string()
    .test('is-empty-ip-or-hostname', t('validation.network.ipOrHostname'), isIpOrHostnameOrEmpty);

export const ipOrHostname = (t: TFunction) =>
  yup.string().test('is-ip-or-hostname', t('validation.network.ipOrHostname'), isIpOrHostname);

export const multicast = (t: TFunction) =>
  yup.string().test('is-multicast', t('validation.multicast'), isMulticast);

export const ipv6 = (t: TFunction) => yup.string().matches(ipv6Regex, t('validation.network.ipv6'));

export const netmask = (t: TFunction) =>
  yup.string().matches(netmaskRegex, t('validation.network.netmask'));

export const domain = (t: TFunction) =>
  yup.string().matches(domainRegex, t('validation.network.domain'));

export const port = (t: TFunction) =>
  yup
    .number()
    .typeError(t('validation.port'))
    .min(1, t('validation.port'))
    .max(65535, t('validation.port'));

export const dnsOrEmpty = (t: TFunction) =>
  yup.string().test('is-dns', t('validation.network.dns'), isDnsOrEmpty);

export const autoAssignOrNumberOrEmpty = (t: TFunction) =>
  yup
    .string()
    .test(
      'is-empty-auto-assign-or-number',
      t('validation.stream.autoAssign'),
      isAutoAssignOrNumber,
    );

export const alphabetic = (t: TFunction) =>
  yup.string().matches(/^[a-zA-Z]+$/, t('validation.nonAlphabetic'));


export const submitAndValidate = async <T>(
  formContext: FormikProps<T>,
  _t: TFunction,
): Promise<void> => {
  //TODO try
  // const isInitialValid = schema.isValidSync(initialValues);
  return formContext.validateForm().then((errors) => {
    if (errors != null) {
      /*eslint no-console: 0*/
      Config.isDebug && console.log('Validation errors', formContext.errors);
      // DispatchNotification(t('validation.invalidSubmit', { count: Object.keys(formContext.errors).length }), NotificationVariant.ERROR, t);
    }
    return formContext.submitForm();
  });
};

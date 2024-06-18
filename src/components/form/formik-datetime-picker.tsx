import { useField } from 'formik';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { constants } from 'src/constants';
import { Label } from './label';
import { FormField } from './form-field';

interface Props {
  name: string;
  title?: string;
  minimumDate?: any;
  maximumDate?: any;
}

export const FormikDatetimePicker: React.FunctionComponent<Props> = ({
  name,
  title,
  minimumDate,
  maximumDate,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, meta, helper] = useField(name);
  const hasErrors = meta.error && meta.touched;
  const valueMoment = meta.value || moment();
  const serverTimeText = valueMoment?.format(constants.momentFormat.dateTime);
  // recreate date in local browser time, since our DatePicker only supports that.
  const localTimeReinterpreted = moment(serverTimeText, constants.momentFormat.dateTime); // This removes the timezone from the passed date.

  return (
    <>
      <FormField {...rest}>
        {title && <Label>{title}</Label>}
        <DateTimePicker
          name={name}
          invalid={hasErrors}
          datetime={{
            dateFormat: constants.momentFormat.dateTime,
            initialDate: localTimeReinterpreted,
            format24Hour: moment().format('LT').length <= 5,
            minimumDate: minimumDate,
            maximumDate: maximumDate,
            localeInfo: {
              amLabel: t('date.picker.amLabel'),
              applyLabel: t('date.picker.applyLabel'),
              backLabel: t('date.picker.backLabel'),
              cancelLabel: t('date.picker.cancelLabel'),
              confirmLabel: t('date.picker.confirmLabel'),
              hhPlaceholder: t('date.picker.hhPlaceholder'),
              hoursLabel: t('date.picker.hoursLabel'),
              locale: navigator.language,
              mmPlaceholder: t('date.picker.mmPlaceholder'),
              monthLabel: t('date.picker.monthLabel'),
              pmLabel: t('date.picker.pmLabel'),
              yearLabel: t('date.picker.yearLabel'),
            },
          }}
          as="select"
          onChange={(date: any) => {
            helper.setTouched(true);
            helper.setValue(moment(date));
          }}
        />
        <FormFieldError show={hasErrors} mssg={meta.error} />
      </FormField>
    </>
  );
};

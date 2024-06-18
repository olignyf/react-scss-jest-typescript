
import { FormEvent, ReactElement, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next'; 
import { TodosEntry } from './todos-model';
import { Modal } from 'src/components/modal';
import { Formik, FormikProps } from 'formik';
import { FormikInput } from 'src/components/form/formik-input';

/* extends {id:string|number}*/
interface Props {
  id?: string;
  model: Partial<TodosEntry>;
  onApply: (model:Partial<TodosEntry>) => void;
  onClose: () => void;
}

/**
 *
 */
export const TodosAddModal = (props: Props) => {
    const { id, model, onApply, onClose, ...rest } = props;
    const { t } = useTranslation();  
   // const formRef = useRef<FormikProps<Partial<TodosEntry>>>(null);
    const formRef = useRef<FormikProps<any>>(null);
    const fileRef = useRef<any>(null);

    const onApplyLocal = (ev: FormEvent<HTMLFormElement>) => {
      formRef.current?.setFieldValue('file', fileRef.current.files[0]); // formik wont add automatically the drop zone file in the form so do it manually here
      return formRef.current?.handleSubmit(ev);
     // onApply(formRef.current?.values) 
    }

    return <Modal id={id} {...rest} onApply={onApplyLocal} onCancel={onClose} acceptLabel={t('general.buttons.Create')} cancelLabel={t('general.buttons.Cancel')}>
       Add Todo
       <Formik 
       initialValues={model}
      onSubmit={props.onApply}
      innerRef={formRef}>
      {(_formikProps) => {
        return (<>
       <input />
       <FormikInput type="text" name="name" />
       <FormikInput type="text" name="details" /> 
       <input type="file" name="file" ref={fileRef} /></>
        )}}
        </Formik>
    </Modal>; 
  };
  
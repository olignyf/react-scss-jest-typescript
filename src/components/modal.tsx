
import { FormEvent, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next'; 

/* extends {id:string|number}*/
interface Props {
     acceptLabel?: string;
 cancelLabel?: string;
  children?: React.ReactNode;
  id?: string;
  onApply: (ev:Event|FormEvent<HTMLFormElement>) => Promise<any> | void;
  onClose: () => void;

}

/**
 *
 */
export const Modal = (props: Props) => {
    const {  acceptLabel, cancelLabel,children,id, onApply ,onClose ,...rest } = props;
    const { t } = useTranslation();
  
    return  <div className="p0p-modal" id={id} {...rest}>
        <div className="p0p-modal-body">
            <button type="button" className="p0p-close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
      {children}
      <footer>       
        
          {acceptLabel && <button type="button" className="p0p-accept" data-dismiss="modal" aria-label="Accept" onClick={onApply}>
            {acceptLabel}
          </button>}
          {cancelLabel && <button type="button" className="p0p-accept" data-dismiss="modal" aria-label="Cancel" onClick={onClose}>
            {cancelLabel}
          </button>}</footer></div>
    </div>;
  };
  
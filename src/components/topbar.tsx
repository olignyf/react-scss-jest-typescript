
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next'; 

/* extends {id:string|number}*/
interface Props {
  id?: string;
  onAdd: () => void;
}

/**
 *
 */
export const Topbar = (props: Props) => {
    const { id, onAdd, ...rest } = props;
    const { t } = useTranslation();
  
    return  <div id={id} {...rest}>
      {onAdd && <button onClick={onAdd}>{t('general.add')}</button>}
    </div>;
  };
  
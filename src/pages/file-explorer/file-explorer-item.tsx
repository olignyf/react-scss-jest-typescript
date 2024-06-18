
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next'; 
import { FileExplorerEntry } from './file-explorer-models';

/* extends {id:string|number}*/
interface Props {
  id?: string;
  model: FileExplorerEntry;
}

/**
 *
 */
export const FileExplorerItem = (props: Props) => {
    const { id, model, ...rest } = props;
    const { t } = useTranslation();
  
    return  <tr className="item" id={id} {...rest}>
       <td>{model.filename}</td>
       <td>{model.ctime}</td>
       <td>{model.mtime}</td>
       <td>{model.size}</td>
    </tr>;
  };
  
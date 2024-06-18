
import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, Route, Router, Routes, useNavigate } from 'react-router-dom';
import { GenericObject } from 'src/models/generics';
import { fetchFileEntries } from './file-explorer-store';
import { FileExplorerEntry } from './file-explorer-models';
import { FileExplorerList } from './file-explorer-list';

/* extends {id:string|number}*/
interface Props {
  id?: string;
}

/**
 *
 */
export const FileExplorer = (props: Props) => { 
    const { id, ...rest } = props;
    const { t } = useTranslation();

    const [files, setFiles] = useState<Record<string, FileExplorerEntry>>({})

    useEffect(() => {
    fetchFileEntries(t).then((res) => {
      if (res.ok && res.data && res.data.list) {
       // console.log(res.data)
        setFiles(res.data.list);
      }
    })
    }, [])
  
    return  <div id={id} {...rest}>
    <h1>{t('fileExplorer.title')}</h1>
    <FileExplorerList list={files}/>
    </div>;
  };
  
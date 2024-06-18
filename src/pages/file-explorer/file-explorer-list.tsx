
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileExplorerItem } from './file-explorer-item';
import { FileExplorerEntry } from './file-explorer-models';
import { SortDirection, SortManager, SortType } from 'src/components/sort-manager';
import { sessionStore } from 'src/authentication/sessions-store';
import { constants } from 'src/constants';
import { useLocalStorage } from 'src/hooks/useLocalStorage';

/* extends {id:string|number}*/
interface Props {
  id?: string;
  list: Record<string,FileExplorerEntry>;
}

/**
 *
 */
export const FileExplorerList = (props: Props) => {
    const { id, list, ...rest } = props;
    const { t } = useTranslation();
 // console.log('list', list)
 
 const storageKey = "fileExplorer";
 const sortByKey = `${constants.localStoragePrefix}:${storageKey}:sortBy:${sessionStore.username}`;
 const sortDirectionKey = `${constants.localStoragePrefix}:${storageKey}:sortDirection:${sessionStore.username}`;
 const [sorting, setSorting] = useLocalStorage(sortByKey, 'size');
 const [direction, setDirection] = useLocalStorage(sortDirectionKey, SortDirection.ASCENDING);

 const sortInfo = {
  filename: { title: t('sort.sortText.name'), type: SortType.NATURAL_SORT },
  ctime: { title: t('sort.sortText.status'), type: SortType.GENERIC },
  mtime: { title: t('sort.sortText.status'), type: SortType.GENERIC },
  size: { title: t('sort.sortText.status'), type: SortType.GENERIC },
};
   const values = Object.values(list);
    return  <table id={id} {...rest}>
      <thead>
       <th>Filename</th>
       <th>Created Time</th>
       <th>Modified Time</th>
       <th onClick={() => {
        alert('sorrr')
        if (sorting === 'size') {
          if (direction === SortDirection.ASCENDING) {
          setDirection(SortDirection.DESCENDING)
          } else {
          setDirection(SortDirection.ASCENDING)
          }    
          return;
        }
        setSorting('size')
      }
      }>Size</th>
       </thead>
       <tbody>
      <SortManager uuid="filename" sortInfo={sortInfo} list={values} sortKey={sorting} direction={direction}>
    {Object.keys(list).map(entry => {
      return <FileExplorerItem key={entry} model={list[entry]}/>
    })}
    </SortManager></tbody>
   
    </table>;
  };
  
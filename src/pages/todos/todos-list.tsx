
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SortDirection, SortManager, SortType } from 'src/components/sort-manager';
import { sessionStore } from 'src/authentication/sessions-store';
import { constants } from 'src/constants';
import { useLocalStorage } from 'src/hooks/useLocalStorage';
import { TodosEntry } from './todos-model';
import { TodosItem } from './todos-item';

/* extends {id:string|number}*/
interface Props {
  id?: string;
  list: Record<string,TodosEntry>;
}

/**
 *
 */
export const TodosList = (props: Props) => {
    const { id, list, ...rest } = props;
    const { t } = useTranslation();
 // console.log('list', list)
 
 const storageKey = "todos";
 const sortByKey = `${constants.localStoragePrefix}:${storageKey}:sortBy:${sessionStore.username}`;
 const sortDirectionKey = `${constants.localStoragePrefix}:${storageKey}:sortDirection:${sessionStore.username}`;
 const [sorting, setSorting] = useLocalStorage(sortByKey, 'name');
 const [direction, setDirection] = useLocalStorage(sortDirectionKey, SortDirection.ASCENDING);

 const sortInfo = {
  name: { title: t('sort.sortText.name'), type: SortType.NATURAL_SORT },
  //ctime: { title: t('sort.sortText.status'), type: SortType.GENERIC },
 // mtime: { title: t('sort.sortText.status'), type: SortType.GENERIC },
};

const onSort= () => {
        if (sorting === 'size') {
          if (direction === SortDirection.ASCENDING) {
          setDirection(SortDirection.DESCENDING)
          } else {
          setDirection(SortDirection.ASCENDING)
          }    
          return;
        }
        setSorting('size')
      };

   const values = Object.values(list);
   console.log(values) //<ul id={id} {...rest}>
    return <div id="todos">      <div className="listContainer">      

      <SortManager uuid="id" sortInfo={sortInfo} list={values} sortKey={sorting} direction={direction}>
    {Object.keys(list).map(entry => {
      return <TodosItem key={list[entry].id} model={list[entry]}/>
    })}
    </SortManager>   
    </div></div>;
  };
  
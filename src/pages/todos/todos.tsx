
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TodosList } from './todos-list';
import { createTodoEntry, fetchTodos } from './todos-store';
import { Topbar } from 'src/components/topbar';
import { useModal } from 'src/hooks/use-modal';
import { TodosEntry } from './todos-model';
import { TodosAddModal } from './todos-add-modal';

/* extends {id:string|number}*/
interface Props {
  id?: string;
}

/**
 *
 */
export const Todos = (props: Props) => { 
    const { id, ...rest } = props;
    const { t } = useTranslation();

    const [addShown, showAdd, hideAdd] = useModal();
    const [files, setFiles] = useState<Record<string, TodosEntry>>({})

    useEffect(() => {
    fetchTodos(t).then((res) => {
        console.log(res.data)
      if (res.ok && res.data && res.data.list) {
        setFiles(res.data.list);
      }
    })
    }, [])

    const onSubmitCreateTodo = (model:Partial<TodosEntry>) => {
      console.log('onApply todo', model)
      createTodoEntry(model, t)
    };


  console.log('add shown', addShown)
    return  <div id={id} {...rest}>
    <h1>{t('todos.title')}</h1>
    <Topbar onAdd={showAdd}/>
    <TodosList list={files}/>
    {addShown && <TodosAddModal onClose={hideAdd} onApply={onSubmitCreateTodo} model={{name:'', file:undefined}} />}
    </div>;
  };
  
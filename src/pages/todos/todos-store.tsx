
import { notificationHandler } from 'src/notifications/notification-handler';
import { createWatchStore, updateWatchStore } from 'src/store/watch';
import { GenericStore } from 'src/store/generic-store';
import { APIPath, APIPathWithArguments } from 'src/requests/api-paths';
import { clone } from 'lodash';
import { apiClient } from 'src/requests';import { TFunction } from 'i18next';
import { TodosEntry, TodosEntryResponse, TodosResponse } from './todos-model';


// values will be inited from API at runtime
const TodosEntries: TodosEntry[] = [];
export const todosStore = new GenericStore(TodosEntries, ['updated', 'hidden', 'selected']);
export default todosStore;

const todosWatch = createWatchStore(TodosEntries);

const mapResponseToViewModel = (response: TodosEntryResponse) => {
  return response.model;
}

const mapViewModelToRequest = (viewModel: TodosEntry) => {
  return viewModel;
  
}

const replaceViewModel = (response: TodosEntry, _t: TFunction, selected = false) => {
  const viewModel = response;
  const decoders = [...TodosEntries];
  const index = decoders.findIndex((d) => d.id === viewModel.id);
  if (index > -1) {
    decoders.splice(index, 1, { ...viewModel, selected: selected });
  }
  todosStore.saveResponse(decoders);
};

export const fetchTodos = (_t: TFunction) => {
  return apiClient.genericController.get<TodosResponse>(APIPath.todos.list).then((res) => {
    if (res.ok) {
      const response = res.data;
      if (response) {
        const viewModels:any = response.list || [];
        console.log('ist or record', viewModels)
        todosStore.saveResponse(viewModels as any);
      }
    }
    return res;
  });
};

export const createTodoEntry = (model: any, t: TFunction, displayMsg = true) => {
  const path = APIPathWithArguments(APIPath.todos.add, { id: model.id });
  console.log('will upload todo', model
  )
  return apiClient.genericController
    .upload<TodosEntryResponse>(path, model)
    .then((res) => {
      if (res.ok) {
        const response = res.data;
        if (response && response.model) {
          replaceViewModel(response.model, t);
        }
      }
      return res;
    })
    .then((res) => {
      displayMsg && notificationHandler(
        res,
        t('decoder.notifications.createSuccess', { name: res.data?.model?.name }),
        t('decoder.notifications.createError', { name: model.name }),
        t,
      );

      return res;
    });
};


// update order and content
export const saveTodos = (models: Array<TodosEntry>|Record<string, TodosEntry>, t: TFunction, displayMsg = true) => {
  const path = APIPath.todos.put;
  return apiClient.genericController
    .put<TodosEntryResponse>(path, models)
    .then((res) => {
      if (res.ok) {
        const response = res.data;
        if (response && response.model) {
          replaceViewModel(response.model, t);
        }
      }
      return res;
    })
    .then((res) => {
      displayMsg && notificationHandler(
        res,
        t('todos.notifications.updateAllSuccess'),
        t('todos.notifications.updateAllError'),
        t,
      );

      return res;
    });
};

import { TFunction } from 'i18next';
import { notificationHandler } from 'src/notifications/notification-handler';
import { createWatchStore, updateWatchStore } from 'src/store/watch';
import { GenericStore } from 'src/store/generic-store';
import { FileExplorerEntry, FileExplorerEntryResponse, FileExplorerResponse } from './file-explorer-models';
import { APIPath, APIPathWithArguments } from 'src/requests/api-paths';
import { clone } from 'lodash';
import { apiClient } from 'src/requests';


// values will be inited from API at runtime
const fileExplorerEntries: FileExplorerEntry[] = [];
export const fileExplorerStore = new GenericStore(fileExplorerEntries, ['parent', 'updated', 'hidden', 'selected']);
export default fileExplorerEntries;

const fileExplorerWatch = createWatchStore(fileExplorerStore);
const mapResponseToViewModel = (response: FileExplorerEntryResponse) => {
  return response.model;
}

const mapViewModelToRequest = (viewModel: FileExplorerEntry) => {
  return viewModel;
}

const replaceViewModel = (response: FileExplorerEntry, _t: TFunction, selected = false) => {
  const viewModel = response;
  const decoders = [...fileExplorerEntries];
  const index = decoders.findIndex((d) => d.id === viewModel.id);
  if (index > -1) {
    decoders.splice(index, 1, { ...viewModel, selected: selected });
  }
  fileExplorerStore.saveResponse(decoders);
};

export const fetchFileEntries = (_t: TFunction) => {
  return apiClient.genericController.get<FileExplorerResponse>(APIPath.files.list).then((res) => {
    if (res.ok) {
      const response = res.data;
      if (response) {
        const viewModels:any = response.list || [];// FIXME
        fileExplorerStore.saveResponse(viewModels);
      }
    }
    return res;
  });
};
/*
export const fetchDecoder = (id: number, t: TFunction) => {
  const path = APIPathWithArguments(APIPath.decoder.get, {
    id: id,
  });
  return apiClient.genericController.get<DecoderResponse>(path).then((res) => {
    if (res.ok) {
      const response = res.data;
      if (response) {
        replaceViewModel(response, t);
      }
    }
    return res;
  });
};
*/

export const updateFileExplorerEntry = (model: any, t: TFunction, _displayMsg = true) => {
  const path = APIPathWithArguments(APIPath.files.put, { id: model.id });
  return apiClient.genericController
    .put<FileExplorerEntryResponse>(path, model)
    .then((res) => {
      if (res.ok) {
        const response = res.data;
        if (response) {
          replaceViewModel(response.model, t);
        }
      }
      return res;
    })
    .then((res) => {
      notificationHandler(
        res,
        t('decoder.notifications.updateSuccess', { name: res.data?.model?.filename }),
        t('decoder.notifications.updateError', { name: res.data?.model?.filename }),
        t,
      );

      return res;
    });
};

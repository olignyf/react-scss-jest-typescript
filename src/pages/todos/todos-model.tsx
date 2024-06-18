import { GenericObject } from "src/models/generics";
import { GenericResponse } from "src/requests/generic-response";

export interface TodosEntry extends GenericObject { // rename TodoEntry
    name: string;
    details?: string;
    file?: File;
    ctime?: Date;
    mtime?: Date;
    thumbnail?: string;
}

export interface TodosResponse extends GenericResponse { 
    list?: Record<string, TodosEntry>;
}

export interface TodosEntryResponse extends GenericResponse  {
    model?: TodosEntry;
}
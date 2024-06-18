import { GenericObject } from "src/models/generics";
import { GenericResponse } from "src/requests/generic-response";

export interface FileExplorerEntry extends GenericObject {
    filename: string;
    sha1sum?: string;
    ctime?: Date;
    mtime?: Date;
    parent?: Partial<FileExplorerEntry>;
    size: number;
}

export interface FileExplorerResponse extends GenericResponse { 
    list?: Record<string, FileExplorerEntry>;
}

export interface FileExplorerEntryResponse extends GenericResponse  {
    model?: FileExplorerEntry;
}
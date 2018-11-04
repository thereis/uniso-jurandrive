// @flow

import { AttachmentFile } from "./AttachmentFile";
import { AttachmentStorage } from "./AttachmentStorage";

export class Attachment {
  id: string;
  uid: string;
  ra: string;
  status: string;
  uploadDate: Date;
  file: AttachmentFile;
  storage: AttachmentStorage;

  isSelected: boolean;

  constructor(
    id: string,
    uid: string,
    ra: string,
    status: string,
    uploadDate: Date,
    file: AttachmentFile,
    storage: AttachmentStorage,
    isSelected: boolean
  ) {
    this.id = id;
    this.uid = uid;
    this.ra = ra;
    this.status = status;
    this.uploadDate = uploadDate;
    this.file = file;
    this.storage = storage;
    this.isSelected = isSelected;
  }
}

// @flow

export class AttachmentStorage {
  downloadURL: string;
  storageReference: string;

  constructor(downloadURL: string, storageReference: string) {
    this.downloadURL = downloadURL;
    this.storageReference = storageReference;
  }
}

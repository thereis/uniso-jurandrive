// @flow

export class AttachmentFile {
  name: string;
  size: number;
  type: string;
  originalName: string;

  constructor(name: string, size: number, type: string, originalName: string) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.originalName = originalName;
  }
}

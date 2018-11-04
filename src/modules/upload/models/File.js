// @flow
export class File {
  id: string;
  name: string;
  size: number;
  format: string;
  mime: string;
  content: any;
  originalName: string;
  status: "pending" | "paused" | "uploading" | "uploaded";
  percentage: number;

  constructor(
    id: string,
    name: string,
    size: number,
    format: string,
    mime: string,
    content: any,
    originalName: string,
    status: "pending" | "paused" | "uploading" | "uploaded",
    percentage: number
  ) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.format = format;
    this.mime = mime;

    this.originalName = originalName;

    this.content = content;

    this.status = status;
    this.percentage = percentage;
  }
}

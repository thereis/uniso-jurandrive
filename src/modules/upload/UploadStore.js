import { computed, action, observable, extendObservable } from "mobx";

/**
 * Dependencies
 */
import { UploadService } from "./UploadService";

/**
 * Models
 */
import { User } from "../authentication/models/User";
import { File } from "./models/File";
import { Attachment } from "./models/Attachment";

class Store {
  @observable
  files: File[];

  @observable
  userAttachments: Attachment[] = [];

  @observable
  selectedAttachments: Attachments[] = [];

  @computed
  get getFilesList() {
    return !this.files ? [] : this.files.slice();
  }

  @computed
  get allFilesAreUploaded() {
    if (!this.files) return false;
    let counter = this.files.filter(file => file.percentage === 100);
    return counter.length === this.files.length;
  }

  /**
   *
   * This function will handle the dropdown and the select file method
   * @param files Array of files
   */
  @action.bound
  addFiles(files) {
    this.files = files.map((file, index) => {
      let newFileName = file.name.match(/^([^\\]*)\.(\w+)$/);

      return extendObservable(
        {},
        new File(
          index,
          newFileName[1],
          file.size,
          newFileName[2],
          file.type,
          file,
          file.name,
          "pending",
          0
        )
      );
    });

    return this.files;
  }

  /**
   * This method will select all files in the AttachmentsList
   */
  @action.bound
  selectAllAttachments() {
    this.selectedAttachments = this.userAttachments.map(attachment => {
      attachment.isSelected = true;
      return attachment;
    });
  }

  /**
   * This method will unselect all files in the AttachmentsList
   */
  @action.bound
  unselectAllAttachments() {
    this.selectedAttachments = this.userAttachments.map(attachment => {
      attachment.isSelected = false;
      return attachment;
    });
  }

  /**
   * This method will count how many files are selected
   */
  @computed
  get totalSelectedAttachments() {
    return this.selectedAttachments.reduce((prev, next) => {
      if (next.isSelected) {
        return prev + 1;
      } else return prev;
    }, 0);
  }

  /**
   * This method will add a attachment to the selected attachments list
   */
  @action.bound
  addSelectedAttachments(selectedAttachment: Attachment) {
    let current = this.selectedAttachments;

    let exists = current.find(
      attachment => attachment.id === selectedAttachment.id
    );

    if (exists) {
      this.selectedAttachments = this.selectedAttachments.filter(
        attachment => attachment.id !== selectedAttachment.id
      );
    } else {
      this.selectedAttachments.push(selectedAttachment);
    }

    return this.selectedAttachments;
  }

  /**
   *  This method will update automatically the percentage of the uploaded filed
   *
   * @param {string} id The file id
   * @param {string} status The attachment status
   * @param {number} percentage The upload percentage
   */
  @action.bound
  async updateFileStatus(id, status, percentage) {
    let file = this.files.find(file => file.id === id);

    if (!file) {
      throw new Error("File does not exist");
    }

    // Update status and percentage
    file.percentage = percentage;
    file.status = status;

    return file;
  }

  /**
   * Triggers the function to upload all selected files
   */
  @action.bound
  async uploadFiles(user) {
    return await UploadService.uploadFiles(user, this.files);
  }

  /**
   * This method will add the document to the attachments collection
   */
  @action.bound
  async addToAttachments(
    user: User,
    file: File,
    downloadUrl: string,
    reference: string
  ) {
    return await UploadService.addToAttachments(
      user,
      file,
      downloadUrl,
      reference
    );
  }

  /**
   * This method will load all attachments from a user
   *
   * @param {User} user User object
   */
  @action.bound
  async loadUserAttachments(user: User) {
    return await UploadService.loadUserAttachments(user);
  }

  /**
   * This method will return the array of attachments
   */
  @computed
  get getUserAttachments() {
    return this.userAttachments;
  }
}

export const UploadStore = new Store();

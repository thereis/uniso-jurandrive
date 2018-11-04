// @flow

import { firebase, firestore, storage } from "../../firebase";

/**
 * Dependencies
 */
import { UploadStore } from "../upload/UploadStore";
import { AuthenticationStore } from "../authentication/AuthenticationStore";

/**
 * Models
 */
import { User } from "../authentication/models/User";
import { File } from "./models/File";
import { Attachment } from "./models/Attachment";
import { extendObservable } from "mobx";

class Service {
  /**
   * Upload to firebase
   */
  async uploadFiles(user: User, files: File[]) {
    try {
      if (!files) {
        throw new Error("There are no files defined");
      }

      // Iterate over files
      files.forEach(async file => {
        let directory = AuthenticationStore.user.ra;

        let checkIfExists = await this.checkIfAlreadyExists(file);

        // Check if file already exists
        if (checkIfExists) {
          file.name = checkIfExists;
        }

        let uploadTask = storage
          .ref(`${directory}/${file.name}.${file.format}`)
          .put(file.content);

        uploadTask.on(
          "state_changed",
          snapshot => {
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED:
                UploadStore.updateFileStatus(file.id, "paused", progress);
                break;
              case firebase.storage.TaskState.RUNNING:
                UploadStore.updateFileStatus(file.id, "uploading", progress);
                break;

              default:
                break;
            }
          },
          error => {
            // Handle unsuccessful uploads
          },
          async () => {
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(async downloadReference => {
                await UploadStore.addToAttachments(
                  user,
                  file,
                  downloadReference,
                  ""
                );
              });

            UploadStore.updateFileStatus(file.id, "uploaded", 100);
          }
        );
      });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * This method will add the uploaded file to the attachments collection
   */
  async addToAttachments(
    user: User,
    file: File,
    downloadUrl: string,
    reference: string
  ) {
    let newAttachment = new Attachment(
      "",
      user.uid,
      user.ra,
      "uploaded",
      new Date(),
      {
        name: file.name,
        size: file.size,
        type: file.format,
        originalName: file.originalName
      },
      {
        downloadUrl,
        storageReference: reference
      },
      false
    );

    await firestore.collection("attachments").add({ ...newAttachment });
  }

  /**
   * This method will check if file already exists
   */
  async checkIfAlreadyExists(file: File) {
    let query = await firestore
      .collection("attachments")
      .where("file.originalName", "==", file.originalName)
      .get();

    if (query.docs.length === 0) {
      return false;
    } else {
      return `${file.name} (${query.docs.length})`;
    }
  }

  /**
   * This method will fetch all attachments documents from attachments collection
   */
  async loadUserAttachments(user: User) {
    return new Promise(async (resolve, reject) => {
      await firestore
        .collection("attachments")
        .where("ra", "==", user.ra)
        .where("uid", "==", user.uid)
        .orderBy("uploadDate", "desc")
        .onSnapshot(snapshot => {
          UploadStore.userAttachments = snapshot.docs.map(doc => {
            let data = doc.data();

            return extendObservable(
              {},
              new Attachment(
                doc.id,
                data.uid,
                data.ra,
                data.status,
                data.uploadDate,
                {
                  name: data.file.name,
                  size: data.file.size,
                  type: data.file.type,
                  originalName: data.file.originalName
                },
                {
                  downloadURL: data.storage.downloadUrl,
                  storageReference: data.storage.storageReference
                },
                false
              )
            );
          });

          resolve(UploadStore.userAttachments);
        });
    });
  }

  /**
   * This method will delete all files from storage and collection
   */
  async deleteUserAttachments(user: User, attachments: Attachment[]) {
    attachments.forEach(async attachment => {
      let storageRef = storage.ref(
        `${user.ra}/${attachment.file.name}.${attachment.file.type}`
      );

      storageRef.delete().then(async () => {
        await firestore
          .collection("attachments")
          .doc(attachment.id)
          .delete();

        UploadStore.selectedAttachments = [];
      });
    });
  }
}

export const UploadService = new Service();

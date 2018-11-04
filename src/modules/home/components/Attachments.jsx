import React, { Component } from "react";
import { observer } from "mobx-react";
import { withStyles, Paper } from "@material-ui/core";
import AttachmentsList from "./AttachmentsList";
import AttachmentsListHeader from "./AttachmentsListHeader";
import { UploadStore } from "../../upload/UploadStore";
import { UploadService } from "../../upload/UploadService";
import { AuthenticationStore } from "../../authentication/AuthenticationStore";

const styles = theme => ({
  root: {
    width: "100%",
    height: "100%",
    overflowX: "auto"
  }
});

@observer
class Attachments extends Component {
  render() {
    let { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <AttachmentsListHeader
          title={"My drive"}
          numSelected={UploadStore.totalSelectedAttachments}
          onDeleteClick={() => {
            UploadService.deleteUserAttachments(
              AuthenticationStore.user,
              UploadStore.selectedAttachments
            );
          }}
        />
        <AttachmentsList />
      </Paper>
    );
  }
}

export default withStyles(styles)(Attachments);

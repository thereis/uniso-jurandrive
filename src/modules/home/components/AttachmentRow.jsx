import * as React from "react";
import { withStyles, TableRow, TableCell, Checkbox } from "@material-ui/core";
import { observer } from "mobx-react";
import { Attachment } from "../../upload/models/Attachment";
import { UploadStore } from "../../upload/UploadStore";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
});

@observer
class AttachmentRow extends React.Component {
  imgRef;

  /**
   * Select Attachment
   */
  _selectAttachment = (attachment: Attachment) => {
    attachment.isSelected = !attachment.isSelected;
    UploadStore.addSelectedAttachments(attachment);
  };

  /**
   * Utils
   */
  _bytesToSize = bytes => {
    let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  };

  _formatTime = (time: number) => {
    let date: Date = time.toDate();

    return `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString(
      "pt-BR"
    )}`;
  };

  render() {
    let { classes, attachment } = this.props;

    return (
      <TableRow selected={true} className={classes.row}>
        <TableCell padding="checkbox">
          <Checkbox
            onClick={() => this._selectAttachment(attachment)}
            checked={attachment.isSelected}
          />
        </TableCell>
        <TableCell onClick={this.props.onClick}>
          <img
            alt={`${attachment.file.type}`}
            src={`assets/icons/${attachment.file.type}.png`}
            ref={img => (this.imgRef = img)}
            onError={() => (this.imgRef.src = "assets/icons/_blank.png")}
          />
        </TableCell>
        <TableCell component="th" scope="row" onClick={this.props.onClick}>
          {attachment.file.name}
        </TableCell>
        <TableCell onClick={this.props.onClick}>{attachment.ra}</TableCell>
        <TableCell onClick={this.props.onClick}>
          {this._formatTime(attachment.uploadDate)}
        </TableCell>
        <TableCell onClick={this.props.onClick}>
          {this._bytesToSize(attachment.file.size)}
        </TableCell>
      </TableRow>
    );
  }
}

export default withStyles(styles)(AttachmentRow);

import { Dialog } from "primereact/dialog";
import React, { memo } from "react";

const CommonDeleteConfirmation = props => {
  const { open, hideContent, footerContent } = props;
  return (
    <Dialog
      modal
      visible={open}
      header="Delete Confirmation"
      style={{ width: "32rem", fontFamily: "Helvetica" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      footer={footerContent}
      onHide={hideContent}
    >
      <div className="d-flex align-middle justify-center gap-2 confirmation-content">
        <i
          className="d-flex justify-center pi pi-exclamation-triangle"
          style={{ alignItems: "center" }}
        />
        <span>{`Are you sure you want to delete the selected item`}</span>
      </div>
    </Dialog>
  );
};

export default memo(CommonDeleteConfirmation);

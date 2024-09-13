import { Dialog } from "primereact/dialog";
import React, { memo } from "react";

const CommonDeleteConfirmation = props => {
  const { itemName, open, hideContent, footerContent } = props;
  return (
    <Dialog
      modal
      visible={open}
      header="Confirm"
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      footer={footerContent}
      onHide={hideContent}
    >
      <div className="confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        <span
        >{`Are you sure you want to delete the selected ${itemName}`}</span>
      </div>
    </Dialog>
  );
};

export default memo(CommonDeleteConfirmation);

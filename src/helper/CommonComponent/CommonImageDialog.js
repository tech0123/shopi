import { Dialog } from "primereact/dialog";
import React from "react";
import { Image } from "react-bootstrap";
const CommonImageDialog = (props) => {
  const { selectedImage, imageDialog, setImageDialog } = props;

  return (
    <>
      <Dialog
        visible={imageDialog}
        onHide={() => setImageDialog(false)} // Close the dialog
        style={{ width: "100%", height: "100%" }} // Adjust the size as needed
        className="image_modal"
      >
        <Image
          src={selectedImage}
          alt="Selected Image"
          className="shadow-2 border-round w-100 h-100 object-fit-cover"
          width={100}
          height={100}
          style={{ objectFit: "cover" }}
        />
      </Dialog>
    </>
  );
};

export default CommonImageDialog;

import React from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { uploadImage } from "../../axios/media.axios";

import styles from "./Dropzone.module.scss";

function MyDropzone({ filePreview, setFilePreview, setImage, text }) {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: "image/*",
    maxFiles: 1,
    maxSize: 1048576,

    onDropAccepted: async (acceptedFiles) => {
      let formData = new FormData();
      formData.append("image", acceptedFiles[0]);
      let url = await uploadImage(formData);
      setFilePreview(url);
      setImage(url);
    },
  });

  return (
    <div {...getRootProps({ className: "dropzone" })} onClick={open}>
      <input className={styles.uploadEvent} {...getInputProps()} />
      <div className={styles.uploadEvent}>
        {filePreview ? (
          <Image
            width={320}
            height={320}
            className={styles.eventImage}
            alt="image"
            src={filePreview}
          />
        ) : (
          <Image width={50} height={50} alt="image" src="/images/upload.png" />
        )}
      </div>
      <div>
        {filePreview ? (
          <p className={styles.imageName}> {acceptedFiles[0]?.path}</p>
        ) : (
          <p className={styles.banner}> {text}</p>
        )}
      </div>
    </div>
  );
}

export default MyDropzone;

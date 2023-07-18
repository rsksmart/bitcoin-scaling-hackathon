import React from "react";
import Pagination from "react-bootstrap/Pagination";

import styles from "./pagination.module.scss";

const PagePagination = ({ data, take, setSkip }) => {
  let items = [];
  const onMoreData = (e) => {
    setSkip((Number(e.target.text) - 1) * take);
  };
  const numberOfPages = Math.ceil(data?.length / take);

  for (let number = 1; number <= numberOfPages; number++) {
    items.push(
      <Pagination.Item onClick={onMoreData} key={number}>
        {number}
      </Pagination.Item>
    );
  }

  return (
    <>
      {data?.length > take ? (
        <div className={styles.paginationDiv}>
          {/* <div className={styles.backArrow}>
            <span className={styles.arrowSpan}></span>
          </div> */}
          <div>
            <Pagination>{items}</Pagination>
          </div>

          {/* <div className={styles.nextArrow}>
            <span className={styles.arrowSpan}></span>
          </div> */}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PagePagination;

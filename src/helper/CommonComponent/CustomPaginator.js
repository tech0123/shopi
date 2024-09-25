import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import LeftArrow from '../../Images/left-arrow.svg';
import RightArrow from '../../Images/right-arrow.svg';
import { memo } from 'react';
import Image from 'next/image';

const CustomPaginator = ({
  dataList,
  pageLimit,
  currentPage,
  totalCount,
  onPageChange,
  onPageRowsChange,
}) => {
  const template = {
    layout:
      currentPage === 0
        ? 'CurrentPageReport RowsPerPageDropdown'
        : 'PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown',
    PrevPageLink: (options) => {
      return (
        <button
          className="border-0 p-2 bg-transparent hover:bg-gray-200 rounded"
          onClick={() => onPageChange({ page: 'Prev' })}
          disabled={currentPage === 1}
        >
          <Image
            src={LeftArrow}
            alt="left-arrow"
            className="rounded-full"
            width={24}
            height={24}
          />
        </button>
      );
    },
    NextPageLink: (options) => {
      const totalPages = Math.ceil(totalCount / pageLimit);
      return (
        <button
          className="border-0 p-2 bg-transparent hover:bg-gray-200 rounded"
          onClick={() => onPageChange({ page: 'Next' })}
          disabled={dataList?.length === 0 || currentPage === totalPages}
        >
          <Image
            src={RightArrow}
            alt="right-arrow"
            className="rounded-full"
            width={24}
            height={24}
          />
        </button>
      );
    },
    PageLinks: (options) => {
      const isSelected = options.page === currentPage - 1;

      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        return <span className="select-none">...</span>;
      }

      return (
        <Button
          type="button"
          className={`p-paginator-page p-paginator-element p-link ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-md p-2 hover:bg-blue-300`}
          onClick={() => onPageChange(options.page + 1)}
        >
          {options.page + 1}
        </Button>
      );
    },
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 7, value: 7 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: 100, value: 100 },
        { label: 'All', value: 0 },
      ];

      return (
        <Dropdown
          value={options.value}
          options={dropdownOptions}
          onChange={(e) => onPageRowsChange(e.value)}
          className="border border-gray-300 rounded-md"
        />
      );
    },
  };

  return (
    <>
      <Paginator
        rows={pageLimit}
        first={currentPage * pageLimit}
        totalRecords={totalCount}
        currentPageReportTemplate={`Showing ${pageLimit * (currentPage - 1) + (dataList?.length ? 1 : 0)} to ${pageLimit * (currentPage - 1) + (dataList?.length ? dataList?.length : 0)} of ${totalCount ? totalCount : 0} entries`}
        template={template}

      />
    </>
  );
}

export default memo(CustomPaginator);

import type { PaginationProps } from "@data/index.types";

import { DateTime } from "luxon";

import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import Button from "@components/Button";

const Pagination = ({ date, options }: PaginationProps) => {
  const { year, month } = date;
  const { changeDate } = options;

  const timeObj = DateTime.fromObject({
    year: year,
    month: month,
  });

  const prevMonth = timeObj.minus({ month: 1 });
  const nextMonth = timeObj.plus({ month: 1 });

  return (
    <div className="flex items-center gap-2">
      <Button
        intent="secondary"
        hoverable={false}
        onClick={() =>
          changeDate({ year: prevMonth.year, month: prevMonth.month })
        }
      >
        <span className="hidden items-center gap-3 sm:flex">
          <BsChevronLeft />
          Trước
        </span>
        <span className="flex -space-x-2 sm:hidden">
          <BsChevronLeft />
          <BsChevronLeft />
          <BsChevronLeft />
        </span>
      </Button>

      <Button
        intent="primary"
        hoverable={false}
        onClick={() =>
          changeDate({ year: nextMonth.year, month: nextMonth.month })
        }
      >
        <span className="hidden items-center gap-3 sm:flex">
          Sau
          <BsChevronRight />
        </span>
        <span className="flex -space-x-2 sm:hidden">
          <BsChevronRight />
          <BsChevronRight />
          <BsChevronRight />
        </span>
      </Button>
    </div>
  );
};

export default Pagination;

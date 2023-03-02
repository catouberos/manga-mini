import type { PaginationProps } from "@data/index.types";

import { useState } from "react";
import { DateTime, type MonthNumbers } from "luxon";

import { BsChevronDown } from "react-icons/bs";
import { Popover, Listbox, Transition } from "@headlessui/react";

import Button from "@components/Button";

const MonthPicker = ({ date, options }: PaginationProps) => {
  const currentYear = DateTime.now().year;
  const { month, year } = date;
  const { changeDate } = options;

  const [selectedYear, changeSelectedYear] = useState(year);
  const [selectedMonth, changeSelectedMonth] = useState(month);

  const availableYear = [
    ...Array.from(
      { length: currentYear - 2021 + 2 }, // get from 2021 + the year after that
      (_, index) => 2021 + index
    ),
  ];

  return (
    <Popover className="relative inline-block">
      <Popover.Button className="flex items-center gap-3 rounded-2xl bg-zinc-200 py-1 px-2 text-2xl font-bold">
        {month}/{year}
        <BsChevronDown className="text-sm" />
      </Popover.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className="absolute mt-6 w-screen max-w-xs space-y-3 rounded-2xl bg-zinc-100 p-3 pb-2 shadow-lg">
          <Listbox value={selectedYear} onChange={changeSelectedYear}>
            <Listbox.Button className="relative w-full rounded-xl bg-zinc-200 py-1 px-2 text-lg font-bold transition-all duration-300 hover:bg-zinc-300">
              <span>{selectedYear}</span>
              <span className="absolute inset-y-0 right-2 flex items-center">
                <BsChevronDown className="text-sm" />
              </span>
            </Listbox.Button>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 -translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Listbox.Options className="absolute inset-x-0 max-h-40 overflow-auto rounded-xl bg-zinc-200">
                {availableYear.map((year) => (
                  <Listbox.Option
                    key={year}
                    value={year}
                    className={({ active }) =>
                      `w-full cursor-default py-1 px-2 text-center ${
                        active ? "bg-zinc-300" : "bg-inherit"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <span className={`${selected && "font-bold"}`}>
                        {year}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
          <div className="grid grid-cols-3 gap-1">
            {[...Array(12)].map((_, i) => (
              <Button
                key={i}
                hoverable={false}
                intent={selectedMonth === i + 1 ? "primary" : "none"}
                onClick={() => changeSelectedMonth((i + 1) as MonthNumbers)}
                className={selectedMonth !== i + 1 ? `hover:bg-zinc-200` : ""}
              >
                Tháng {i + 1}
              </Button>
            ))}
          </div>
          <Button
            intent="secondary"
            hoverable={false}
            className="w-full"
            onClick={() =>
              changeDate({
                year: selectedYear,
                month: selectedMonth,
              })
            }
          >
            Chọn
          </Button>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default MonthPicker;

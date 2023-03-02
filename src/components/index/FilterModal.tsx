import type { FilterModalProps } from "@data/index.types";

import { useState } from "react";

import { Dialog } from "@headlessui/react";

import Button from "@components/Button";
import Modal from "@components/Modal";

const FilterModal = ({
  isOpen,
  onClose,
  values,
  checkedValues,
  handler,
}: FilterModalProps) => {
  const [currentValues, setCurrentValues] = useState<string[]>(checkedValues);

  const changeCurrentValues = (checked: boolean, filterId: string) => {
    if (!checked) {
      // if uncheck
      setCurrentValues(currentValues.filter((value) => value != filterId)); //remove filterId from array
    } else {
      setCurrentValues([...currentValues, filterId]); // add filterId to array
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <Dialog.Title className="m-6 text-2xl font-bold lg:text-3xl">
          Lọc theo nhà xuất bản/phát hành
        </Dialog.Title>
        <Dialog.Description as="div" className="m-6">
          <div className="grid gap-x-3 gap-y-1 sm:grid-cols-2">
            <Button
              intent="secondary"
              className="mb-3"
              onClick={() =>
                setCurrentValues([...values.map((value) => value.id)])
              }
            >
              Chọn tất cả
            </Button>
            <Button
              intent="none"
              className="mb-3"
              onClick={() => setCurrentValues([])}
            >
              Bỏ chọn tất cả
            </Button>
            {values.map((value) => (
              <div key={value.id} className="flex items-center">
                <input
                  id={value.id}
                  checked={currentValues.includes(value.id)}
                  style={{ color: value.color }}
                  type="checkbox"
                  className={`h-4 w-4 rounded border-gray-300 transition-all focus:ring-zinc-400`}
                  onChange={({ target }) =>
                    changeCurrentValues(target.checked, value.id)
                  }
                />
                <label
                  htmlFor={`${value.id}`}
                  className="ml-3 text-sm text-zinc-600"
                >
                  {value.name}
                </label>
              </div>
            ))}
          </div>
          <Button
            onClick={() => handler(currentValues)}
            intent={currentValues != checkedValues ? "primary" : "secondary"}
            className="mt-3 w-full font-bold"
          >
            Lọc
          </Button>
        </Dialog.Description>
      </div>
    </Modal>
  );
};

export default FilterModal;

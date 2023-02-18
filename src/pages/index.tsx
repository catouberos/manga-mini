import type { InferGetStaticPropsType } from "next";
import type {
  FilterModalProps,
  InfoModalProps,
  ReleasesView,
  ReleasesProps,
  DateObj,
  PaginationProps,
} from "@data/index.types";
import type {
  Publication,
  PublicationByDate,
  Publisher,
} from "@data/public.types";

import { VND } from "@data/config";

import { useEffect, useState } from "react";
import { DateTime, MonthNumbers } from "luxon";
import useSWR from "swr";

import { Dialog, Listbox, Popover, Transition } from "@headlessui/react";
import { NextSeo } from "next-seo";
import {
  BsBoxArrowUpRight,
  BsCalendar2CheckFill,
  BsChevronLeft,
  BsChevronRight,
  BsFilter,
  BsColumnsGap,
  BsListUl,
  BsChevronDown,
  BsArrowDownShort,
  BsArrowUpShort,
  BsFacebook,
  BsYoutube,
} from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";
import Image from "next/image";

import Layout from "@layouts/Layout";

import Card from "@components/Card";
import Button from "@components/Button";
import Badge from "@components/Badge";
import Cover from "@components/Cover";
import Modal from "@components/Modal";

const MonthSelect = ({ date, options }: PaginationProps) => {
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

const InfoModal = ({ isOpen, onClose, data }: InfoModalProps) => {
  if (data)
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:max-w-[250px]">
            <Cover
              entry={data}
              sizes="(max-width: 768px) 80vw, (max-width: 1024px) 25vw, 15vw"
              fit="full"
            />
          </div>
          <div className="flex-1 p-6 sm:pt-9">
            <div className="flex h-full flex-col justify-between">
              <div>
                <Dialog.Title className="mb-3 text-2xl font-bold lg:text-3xl">
                  {data.name}
                </Dialog.Title>
                <Dialog.Description>
                  <b>Ngày phát hành</b>:{" "}
                  {DateTime.fromISO(data.date).toLocaleString(
                    DateTime.DATE_SHORT
                  )}
                  <br />
                  {data.edition && (
                    <>
                      <b>Phiên bản</b>: {data.edition}
                      <br />
                    </>
                  )}
                  <br />
                  <b>Nhà xuất bản/phát hành</b>: {data.publisher.name}
                  <br />
                  <b>Giá dự kiến</b>: {VND.format(data.price)}
                </Dialog.Description>
              </div>
              <div className="mt-6">
                <div className="mt-1 flex gap-2">
                  <Button className="bg-[#c92127] text-zinc-50">
                    <a
                      href={`https://fahasa.com/catalogsearch/result/?q=${data.name}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Image
                        src="/img/fahasa-logo.png"
                        alt="FAHASA"
                        width={107}
                        height={20}
                      />
                    </a>
                  </Button>
                  <Button className="bg-[#1a94ff] text-zinc-50">
                    <a
                      href={`https://tiki.vn/search?q=${data.name}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Image
                        src="/img/tiki-logo.png"
                        alt="Tiki"
                        width={30}
                        height={20}
                      />
                    </a>
                  </Button>
                  <Button className="bg-[#ff6633] text-zinc-50">
                    <a
                      href={`https://shopee.vn/search?keyword=${data.name}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Image
                        src="/img/shopee-logo.png"
                        alt="Shopee"
                        width={59}
                        height={20}
                      />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex animate-pulse flex-col sm:flex-row">
        <div className="h-[600px] w-full bg-zinc-200 sm:h-[400px] sm:max-w-[250px]"></div>
        <div className="flex-1 p-6 sm:pt-9">
          <div className="flex h-full flex-col justify-between">
            <div>
              <Dialog.Title className="mb-3 text-2xl font-bold lg:text-3xl">
                <div className="h-6 w-full rounded bg-zinc-300"></div>
                <div className="mt-3 h-6 w-2/3 rounded bg-zinc-300"></div>
              </Dialog.Title>
              <Dialog.Description>
                <div className="mt-6 h-5 w-2/3 rounded bg-zinc-300"></div>
                <div className="mt-6 h-5 w-2/3 rounded bg-zinc-300"></div>
                <div className="mt-3 h-5 w-2/3 rounded bg-zinc-300"></div>
              </Dialog.Description>
            </div>
            <div className="mt-6">
              <div className="mt-1 flex gap-2">
                <Button className="bg-[#c92127] text-zinc-50">
                  <Image
                    src="/img/fahasa-logo.png"
                    alt="FAHASA"
                    width={107}
                    height={20}
                  />
                </Button>
                <Button className="bg-[#1a94ff] text-zinc-50">
                  <Image
                    src="/img/tiki-logo.png"
                    alt="Tiki"
                    width={30}
                    height={20}
                  />
                </Button>
                <Button className="bg-[#ff6633] text-zinc-50">
                  <Image
                    src="/img/shopee-logo.png"
                    alt="Shopee"
                    width={59}
                    height={20}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const GridView = ({ releases, isLoading, options }: ReleasesView) => {
  const { setModalOpen, setModalData } = options;

  if (isLoading)
    return (
      <>
        {[...Array(8)].map((_, i) => {
          return (
            <div className="container mx-auto animate-pulse px-6" key={i}>
              <div className={`mt-12 mb-6 flex items-center text-xl font-bold`}>
                <span className="capitalize">
                  <div className="h-6 w-72 rounded bg-zinc-300"></div>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <div className="h-[240px] w-full rounded bg-zinc-300"></div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </>
    );

  return (
    <>
      {releases.map((releaseGroup) => {
        let date = DateTime.fromISO(releaseGroup.date);
        let today = DateTime.now();

        return (
          <div className="container mx-auto px-6" key={date.valueOf()}>
            <div className={`mt-12 mb-3 flex items-center text-xl font-bold`}>
              <span className="capitalize">
                {date.toFormat("EEEE - dd/MM")}
              </span>
              {date < today && <Badge intent="success">Đã phát hành!</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
              {releaseGroup.entries.map((release) => (
                <Card
                  onClick={() => {
                    setModalData(release);
                    setModalOpen(true);
                  }}
                  key={release.id}
                  clickable={true}
                >
                  {release.edition && (
                    <Badge className="absolute top-0 right-0 bg-amber-200/75 backdrop-blur-md">
                      {release.edition}
                    </Badge>
                  )}
                  <Cover
                    entry={release}
                    sizes="(max-width: 768px) 40vw, 200px"
                  />
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

const ListView = ({ releases, isLoading, options }: ReleasesView) => {
  const { setModalOpen, setModalData } = options;

  if (isLoading)
    return (
      <div className="mx-auto overflow-auto lg:container">
        <div className="min-w-fit px-6">
          <div className="mt-12 grid min-w-max animate-pulse grid-cols-6 overflow-hidden rounded-2xl border">
            <span className="border-r p-3 text-center font-bold">
              Ngày phát hành
            </span>
            <span className="col-span-4 p-3 font-bold">Tên</span>
            <span className="p-3 font-bold">Giá</span>
            {[...Array(4)].map((_, i) => {
              return (
                <>
                  <div
                    className="flex h-full items-center justify-center border-t border-r p-3 font-bold"
                    style={{
                      gridRow: `span 5 / span 5`,
                    }}
                  >
                    <div className="h-5 w-2/3 rounded bg-zinc-300"></div>
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <>
                      <div className="col-span-4 flex cursor-pointer items-center gap-3 border-t p-3 decoration-primary decoration-2 hover:underline">
                        <div className="h-5 w-2/3 rounded bg-zinc-300"></div>
                      </div>
                      <div className="border-t p-3">
                        <div className="h-5 w-2/3 rounded bg-zinc-300"></div>
                      </div>
                    </>
                  ))}
                </>
              );
            })}
          </div>
        </div>
      </div>
    );

  return (
    <div className="mx-auto overflow-auto lg:container">
      <div className="min-w-fit px-6">
        <div className="mt-12 grid min-w-max grid-cols-6 overflow-hidden rounded-2xl border">
          <span className="border-r p-3 text-center font-bold">
            Ngày phát hành
          </span>
          <span className="col-span-4 p-3 font-bold">Tên</span>
          <span className="p-3 font-bold">Giá</span>
          {releases.map((releaseGroup) => {
            const date = DateTime.fromISO(releaseGroup.date);
            const today = DateTime.now();

            return (
              <>
                <div
                  className="flex h-full items-center justify-center border-t border-r p-3 font-bold"
                  style={{
                    gridRow: `span ${releaseGroup.entries.length} / span ${releaseGroup.entries.length}`,
                  }}
                >
                  <span>{date.toFormat("dd/MM/yyyy")}</span>
                  {date < today && (
                    <BsCalendar2CheckFill className="ml-3 inline-block align-baseline text-green-700" />
                  )}
                </div>
                {releaseGroup.entries.map((release) => (
                  <>
                    <div
                      className="col-span-4 flex cursor-pointer items-center gap-3 border-t p-3 decoration-primary decoration-2 hover:underline"
                      onClick={() => {
                        setModalData(release);
                        setModalOpen(true);
                      }}
                    >
                      <span className="">{release.name}</span>
                      {release.edition && (
                        <Badge className="m-0 bg-amber-200/75 backdrop-blur-md">
                          {release.edition}
                        </Badge>
                      )}
                      <BsBoxArrowUpRight className="inline-block text-zinc-400" />
                    </div>
                    <span className="border-t p-3">
                      {VND.format(release.price)}
                    </span>
                  </>
                ))}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const useReleases = (
  year = DateTime.now().year,
  month = DateTime.now().month,
  order: boolean,
  publishers?: string[]
) => {
  const { data, error, isLoading } = useSWR(
    {
      year,
      month,
      order,
      publishers,
    },
    async ({ year, month, order, publishers }) => {
      const dateObj = DateTime.fromObject({ year, month });

      let url = `/api/releases?start=${dateObj
        .startOf("month")
        .toISODate()}&end=${dateObj.endOf("month").toISODate()}&order=${
        order ? "ascending" : "descending"
      }`;

      publishers?.map((publisher) => (url += `&publisher=${publisher}`));

      return await fetch(url).then((res) => res.json());
    }
  );

  return {
    releases: data as PublicationByDate[],
    isLoading,
    isError: error,
  };
};

const Releases = ({ date, view, filters, order, options }: ReleasesProps) => {
  const { year, month } = date;
  const { publishers } = filters;

  const { releases, isLoading, isError } = useReleases(
    year,
    month,
    order,
    publishers
  );

  if (isError)
    return (
      <div className="container mx-auto mt-12 flex items-center justify-center px-3">
        <div className="text-center">
          <p>{"＼(º □ º l|l)/"}</p>
          <h1 className="my-3 text-4xl font-bold">Nani?</h1>
          <p>
            Chuyện kỳ quái gì đã xảy ra. Vui lòng tải lại trang hoặc liên hệ bọn
            mình nhé.
          </p>
        </div>
      </div>
    );

  if (!isLoading && releases.length == 0)
    return (
      <div className="container mx-auto mt-12 flex items-center justify-center px-3">
        <div className="text-center">
          <p>{"~(>_<~)"}</p>
          <h1 className="my-3 text-4xl font-bold">Không tìm thấy!</h1>
          <p>Có thể lịch phát hành tháng này chưa có, quay lại sau nhé!</p>
        </div>
      </div>
    );

  if (view == true)
    return (
      <GridView isLoading={isLoading} options={options} releases={releases} />
    );
  else
    return (
      <ListView isLoading={isLoading} options={options} releases={releases} />
    );
};

export const getStaticProps = async () => {
  const now = DateTime.now();

  const res = await fetch("https://manga.glhf.vn/api/publishers");
  const publishers: Publisher[] = await res.json();

  return {
    props: {
      publishers,
    },
    revalidate: 600, // revalidate every 10 minutes
  };
};

export default function Home({
  publishers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Publication | undefined>();

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPublishers, changeFilterPublishers] = useState<string[]>([]);

  const [currentView, changeCurrentView] = useState(true); // true = card, false = list
  // load state if persist on browser
  useEffect(() => {
    const view = window.localStorage.getItem("RELEASES_VIEW");
    if (view !== null) changeCurrentView(JSON.parse(view));
  }, []);
  // save view to browser
  useEffect(() => {
    window.localStorage.setItem("RELEASES_VIEW", JSON.stringify(currentView));
  }, [currentView]);

  const [currentOrder, setCurrentOrder] = useState(true); // true = ascending, false = descending

  const now = DateTime.now();

  const [currentDate, changeDate] = useState<DateObj>({
    year: now.year,
    month: now.month,
  });

  return (
    <Layout>
      <NextSeo
        title="Lịch phát hành"
        description="Xem lịch phát hành manga/light-novel."
        openGraph={{
          title: `Lịch phát hành`,
          description: `Xem lịch phát hành manga/light-novel từ các nhà xuất bản.`,
        }}
      />

      <InfoModal
        data={modalData}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        values={publishers}
        checkedValues={filterPublishers}
        handler={changeFilterPublishers}
      />

      <div className="sticky top-0 z-10 bg-zinc-50/75 py-4 pt-20 backdrop-blur-md">
        <div className="container mx-auto flex flex-row justify-between gap-6 px-6">
          <div>
            <span className="hidden text-2xl font-bold sm:inline">
              Lịch phát hành
            </span>{" "}
            <MonthSelect date={currentDate} options={{ changeDate }} />
          </div>
          <div className="flex gap-3">
            <Button
              className="rounded-2xl px-2 text-2xl"
              onClick={() => setCurrentOrder((order) => !order)}
              aria-label="Đổi thứ tự"
              intent="secondary"
            >
              {currentOrder ? <BsArrowDownShort /> : <BsArrowUpShort />}
            </Button>
            <Button
              className="rounded-2xl px-2 text-2xl"
              onClick={() => setFilterOpen((status) => !status)}
              aria-label="Mở bộ lọc"
              intent="secondary"
            >
              <BsFilter />
            </Button>
            <Button
              className="rounded-2xl px-2 text-2xl"
              onClick={() => changeCurrentView((currentView) => !currentView)}
              aria-label="Thay đổi layout"
              intent="secondary"
            >
              {currentView ? <BsListUl /> : <BsColumnsGap />}
            </Button>
          </div>
        </div>
        <div className="container mx-auto mt-3 flex items-center justify-between px-6">
          <Pagination date={currentDate} options={{ changeDate }} />
          <ul className="flex items-center gap-3 text-xl text-zinc-500 sm:hidden">
            <li>
              <a
                href="https://fb.com/truyenbanquyen/"
                className="transition-colors duration-100 ease-linear hover:text-[#1877f2]"
                aria-label="Facebook"
              >
                <BsFacebook />
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/c/truyenbanquyen"
                className="transition-colors duration-100 ease-linear hover:text-[#ff0000]"
                aria-label="YouTube"
              >
                <BsYoutube />
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com/@mi.manga.life"
                className="transition-colors duration-100 ease-linear hover:text-black"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Releases
        date={currentDate}
        view={currentView}
        filters={{ publishers: filterPublishers }}
        order={currentOrder}
        options={{ setModalOpen, setModalData }}
      />
    </Layout>
  );
}

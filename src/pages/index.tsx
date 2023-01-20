import type { InferGetStaticPropsType } from "next";
import type {
  SliderProps,
  FilterModalProps,
  InfoModalProps,
  ReleasesView,
  ReleasesProps,
  DateObj,
  PaginationProps,
} from "@data/index.types";
import type { Publication, PublicationByDate } from "@data/public.types";

import { VND } from "@data/config";
import { getEntries, getPublishers } from "@lib/supabase";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import useSWR from "swr";

import { Dialog, Menu, Switch, Transition } from "@headlessui/react";
import { NextSeo } from "next-seo";
import {
  BsBoxArrowUpRight,
  BsCalendar2CheckFill,
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsChevronCompactLeft,
  BsChevronCompactRight,
  BsFilter,
  BsFillGridFill,
  BsListUl,
} from "react-icons/bs";
import Image from "next/image";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";

import Layout from "@layouts/Layout";

import Card from "@components/Card";
import Button from "@components/Button";
import Badge from "@components/Badge";
import Cover from "@components/Cover";
import Modal from "@components/Modal";

import "@splidejs/react-splide/css/core";
import Header from "@components/Header";

const Slider = ({ data }: SliderProps) => {
  if (data.length == 0) return <Header>Lịch phát hành</Header>;

  return (
    <div className="relative">
      <div className="absolute inset-0 bottom-[30%] bg-zinc-100 shadow-[inset_0_0_1rem_0_rgba(0,0,0,0.1)] dark:bg-zinc-900"></div>
      <Splide
        hasTrack={false}
        options={{
          autoplay: true,
          interval: 5000,
          rewind: true,
          pagination: false,
          speed: 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          breakpoints: {
            640: {
              arrows: false,
              padding: "1.5rem",
              gap: "1rem",
            },
          },
        }}
        className="pt-20 sm:pt-6"
      >
        <div className="block px-6 sm:hidden">
          <span className="font-kanit text-3xl font-bold">Phát hành</span>
        </div>
        <SplideTrack>
          {data.map((release) => (
            <SplideSlide key={release.id}>
              <div className="container mx-auto flex flex-col-reverse gap-6 pb-12 sm:flex-row sm:gap-12 sm:px-6">
                <div className="cursor-default overflow-hidden rounded-2xl shadow-md transition-all ease-in-out hover:shadow-lg sm:basis-72">
                  <Cover
                    entry={release}
                    hero={true}
                    sizes="(max-width: 768px) 80vw, (max-width: 1024px) 25vw, 15vw"
                  />
                </div>
                <div className="sm:flex-1 sm:pt-20">
                  <span className="hidden sm:inline">Phát hành </span>
                  <span className="text-xl sm:text-base">
                    <span className="capitalize">
                      {DateTime.fromISO(release.date).toFormat("EEEE, D")}
                    </span>
                  </span>
                  <h2 className="mt-3 mb-6 hidden font-kanit text-4xl font-bold sm:block">
                    {release.name}
                  </h2>
                  <p className="hidden sm:block">
                    <b>Nhà xuất bản/phát hành</b>: {release.publisher.name}
                    <br />
                    <b>Giá dự kiến</b>: {VND.format(release.price)}
                  </p>
                </div>
              </div>
            </SplideSlide>
          ))}
        </SplideTrack>

        <div className="splide__arrows absolute top-1/2 left-0 right-0 mx-6 flex -translate-y-1/2 transform justify-between">
          <button className="splide__arrow splide__arrow--prev text-4xl text-zinc-500">
            <BsChevronCompactLeft />
          </button>
          <button className="splide__arrow splide__arrow--next text-4xl text-zinc-500">
            <BsChevronCompactRight />
          </button>
        </div>

        <div className="splide__progress absolute top-[70%] left-0 right-0 -z-10 hidden sm:block">
          <div className="splide__progress__bar h-1 bg-primary" />
        </div>
      </Splide>
    </div>
  );
};

const MonthSelect = ({ date, options }: PaginationProps) => {
  const { year, month } = date;
  const { changeDate } = options;

  const timeObj = DateTime.fromObject({
    year: year,
    month: month,
  });

  const prevMonth = DateTime.now().minus({ month: 1 });
  const thisMonth = DateTime.now();
  const nextMonth = DateTime.now().plus({ month: 1 });

  return (
    <div className="z-10 flex items-center gap-3 font-kanit text-2xl font-bold">
      <span>Lịch phát hành</span>
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center gap-3 rounded-2xl bg-zinc-200 py-1 px-2 dark:bg-zinc-700">
          tháng {timeObj.month}
          <BsChevronDown className="text-sm" />
        </Menu.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items className="absolute right-0 mt-3 w-full overflow-hidden rounded-2xl bg-zinc-200 shadow-lg dark:bg-zinc-700">
            <Menu.Item
              as="div"
              onClick={() => changeDate(prevMonth)}
              className="transition-color block cursor-pointer py-1 px-2 duration-75 ease-linear ui-active:bg-zinc-300 ui-active:dark:bg-zinc-600"
            >
              {prevMonth.toFormat("MMMM")}
            </Menu.Item>
            <Menu.Item
              as="div"
              onClick={() => changeDate(thisMonth)}
              className="transition-color block cursor-pointer py-1 px-2 duration-75 ease-linear ui-active:bg-zinc-300 ui-active:dark:bg-zinc-600"
            >
              {thisMonth.toFormat("MMMM")}
            </Menu.Item>
            <Menu.Item
              as="div"
              onClick={() => changeDate(nextMonth)}
              className="transition-color block cursor-pointer py-1 px-2 duration-75 ease-linear ui-active:bg-zinc-300 ui-active:dark:bg-zinc-600"
            >
              {nextMonth.toFormat("MMMM")}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
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
    <div className="flex justify-between">
      <Button
        intent="secondary"
        onClick={() =>
          changeDate({ year: prevMonth.year, month: prevMonth.month })
        }
      >
        <BsChevronLeft /> Trước
      </Button>

      <Button
        intent="primary"
        onClick={() =>
          changeDate({ year: nextMonth.year, month: nextMonth.month })
        }
      >
        Sau <BsChevronRight />
      </Button>
    </div>
  );
};

const FilterModal = ({
  isOpen,
  onClose,
  values,
  handler,
  statedValues,
}: FilterModalProps) => {
  const setFilter = (checked: boolean, filterId: string) => {
    if (!checked) {
      // if uncheck
      handler(statedValues.filter((value) => value != filterId)); //remove filterId from array
    } else {
      handler([...statedValues, filterId]); // add filterId to array
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <Dialog.Title className="m-6 font-kanit text-2xl font-bold lg:text-3xl">
          Lọc theo nhà xuất bản/phát hành
        </Dialog.Title>
        <Dialog.Description
          as="div"
          className="m-6 grid space-y-1 sm:grid-cols-2"
        >
          {values.map((value) => (
            <div key={value.id} className="flex items-center">
              <input
                id={value.id}
                checked={statedValues.includes(value.id)}
                style={{ color: value.color }}
                type="checkbox"
                className={`h-4 w-4 rounded border-gray-300 transition-all focus:ring-zinc-400`}
                onChange={({ target }) => setFilter(target.checked, value.id)}
              />
              <label
                htmlFor={`${value.id}`}
                className="ml-3 text-sm text-zinc-600 dark:text-zinc-400"
              >
                {value.name}
              </label>
            </div>
          ))}
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
                <Dialog.Title className="mb-3 font-kanit text-2xl font-bold lg:text-3xl">
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
        <div className="w-full bg-zinc-200 dark:bg-zinc-700 sm:max-w-[250px]"></div>
        <div className="flex-1 p-6 sm:pt-9">
          <div className="flex h-full flex-col justify-between">
            <div>
              <Dialog.Title className="mb-3 font-kanit text-2xl font-bold lg:text-3xl">
                <div className="dark:bg-zinc-7 h-6 w-full rounded bg-zinc-300 dark:bg-zinc-700"></div>
                <div className="dark:bg-zinc-7 mt-3 h-6 w-2/3 rounded bg-zinc-300 dark:bg-zinc-700"></div>
              </Dialog.Title>
              <Dialog.Description>
                <div className="dark:bg-zinc-7 mt-6 h-5 w-2/3 rounded bg-zinc-300 dark:bg-zinc-700"></div>
                <div className="dark:bg-zinc-7 mt-6 h-5 w-2/3 rounded bg-zinc-300 dark:bg-zinc-700"></div>
                <div className="dark:bg-zinc-7 mt-3 h-5 w-2/3 rounded bg-zinc-300 dark:bg-zinc-700"></div>
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
        {[...Array(8)].map((e, i) => {
          return (
            <div className="container mx-auto animate-pulse px-6" key={i}>
              <div className={`mt-12 mb-6 flex items-center text-xl font-bold`}>
                <span className="capitalize">
                  <div className="dark:bg-zinc-7 h-6 w-72 rounded bg-zinc-300 dark:bg-zinc-700"></div>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
                {[...Array(6)].map((e, i) => (
                  <Card key={i}>
                    <div className="dark:bg-zinc-7 h-[240px] w-full rounded bg-zinc-300 dark:bg-zinc-700"></div>
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
                  cardSize={release.wide ? "wide" : "normal"}
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
      <div className="mx-auto overflow-scroll lg:container">
        <div className="min-w-fit px-6">
          <div className="mt-12 grid min-w-max animate-pulse grid-cols-6 overflow-hidden rounded-2xl border dark:border-zinc-600">
            <span className="border-r p-3 text-center font-bold dark:border-zinc-600 dark:bg-zinc-700">
              Ngày phát hành
            </span>
            <span className="col-span-4 p-3 font-bold dark:bg-zinc-700">
              Tên
            </span>
            <span className="p-3 font-bold dark:bg-zinc-700">Giá</span>
            {[...Array(4)].map((e, i) => {
              return (
                <>
                  <div
                    className="flex h-full items-center justify-center border-t border-r p-3 font-bold dark:border-zinc-600"
                    style={{
                      gridRow: `span 5 / span 5`,
                    }}
                  >
                    <div className="dark:bg-zinc-7 h-5 w-2/3 rounded bg-zinc-300 dark:bg-zinc-700"></div>
                  </div>
                  {[...Array(5)].map((e, i) => (
                    <>
                      <div className="col-span-4 flex cursor-pointer items-center gap-3 border-t p-3 decoration-primary decoration-2 hover:underline dark:border-zinc-600">
                        <div className="dark:bg-zinc-7 h-5 w-2/3 rounded bg-zinc-300 dark:bg-zinc-700"></div>
                      </div>
                      <div className="border-t p-3 dark:border-zinc-600">
                        <div className="dark:bg-zinc-7 h-5 w-2/3 rounded bg-zinc-300 dark:bg-zinc-700"></div>
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
    <div className="mx-auto overflow-scroll lg:container">
      <div className="min-w-fit px-6">
        <div className="mt-12 grid min-w-max grid-cols-6 overflow-hidden rounded-2xl border dark:border-zinc-600">
          <span className="border-r p-3 text-center font-bold dark:border-zinc-600 dark:bg-zinc-700">
            Ngày phát hành
          </span>
          <span className="col-span-4 p-3 font-bold dark:bg-zinc-700">Tên</span>
          <span className="p-3 font-bold dark:bg-zinc-700">Giá</span>
          {releases.map((releaseGroup) => {
            const date = DateTime.fromISO(releaseGroup.date);
            const today = DateTime.now();

            return (
              <>
                <div
                  className="flex h-full items-center justify-center border-t border-r p-3 font-bold dark:border-zinc-600"
                  style={{
                    gridRow: `span ${releaseGroup.entries.length} / span ${releaseGroup.entries.length}`,
                  }}
                >
                  <span>{date.toFormat("dd/MM/yyyy")}</span>
                  {date < today && (
                    <BsCalendar2CheckFill className="ml-3 inline-block align-baseline text-green-700 dark:text-green-200" />
                  )}
                </div>
                {releaseGroup.entries.map((release) => (
                  <>
                    <div
                      className="col-span-4 flex cursor-pointer items-center gap-3 border-t p-3 decoration-primary decoration-2 hover:underline dark:border-zinc-600"
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
                    <span className="border-t p-3 dark:border-zinc-600">
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
  publishers?: string[]
) => {
  const { data, error, isLoading } = useSWR(
    {
      year,
      month,
      publishers,
    },
    async ({ year, month, publishers }) => {
      const dateObj = DateTime.fromObject({ year, month });

      let url = `/api/releases?start=${dateObj
        .startOf("month")
        .toISODate()}&end=${dateObj.endOf("month").toISODate()}`;

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

const Releases = ({ date, view, filters, options }: ReleasesProps) => {
  const { year, month } = date;
  const { publishers } = filters;

  const { releases, isLoading, isError } = useReleases(year, month, publishers);

  if (isError)
    return (
      <div className="container mx-auto mt-12 flex items-center justify-center px-3">
        <div className="text-center">
          <p>{"＼(º □ º l|l)/"}</p>
          <h1 className="my-3 font-kanit text-4xl font-bold">Nani?</h1>
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
          <h1 className="my-3 font-kanit text-4xl font-bold">
            Không tìm thấy!
          </h1>
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

  const upcoming = await getEntries(
    now.toISODate(),
    now.plus({ days: 3 }).toISODate()
  );

  const publishers = await getPublishers();

  return {
    props: {
      publishers,
      upcoming,
    },
    revalidate: 600, // revalidate every 10 minutes
  };
};

export default function Home({
  publishers,
  upcoming,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Publication | undefined>();

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPublishers, changeFilterPublishers] = useState(
    publishers.map((publisher) => publisher.id)
  );

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

  const now = DateTime.now();

  const [currentDate, changeDate] = useState<DateObj>({
    year: now.year,
    month: now.month,
  });

  return (
    <Layout>
      <NextSeo
        title="Lịch phát hành"
        description="Xem lịch phát hành chưa bao giờ là dễ hơn, nay được tổng hợp từ nhiều NXB khác nhau!"
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
        statedValues={filterPublishers}
        handler={changeFilterPublishers}
      />

      <Slider data={upcoming} />

      <div className="container mx-auto px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row">
          <MonthSelect date={currentDate} options={{ changeDate }} />
          <div className="grid grid-cols-2 gap-6 sm:flex">
            <Button
              className="rounded-2xl px-2 text-xl sm:text-2xl lg:text-3xl"
              onClick={() => setFilterOpen(!filterOpen)}
              aria-label="Mở bộ lọc"
              intent="secondary"
            >
              <BsFilter />
            </Button>
            <Switch
              checked={currentView}
              onChange={changeCurrentView}
              className="relative overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-700"
            >
              <span className="sr-only">Thay đổi layout</span>
              <div
                className={`${
                  currentView ? "translate-x-0" : "translate-x-full"
                } absolute top-0 h-full w-1/2 transform bg-primary transition-transform duration-200 ease-in-out`}
              ></div>
              <div className="relative grid w-full grid-cols-2 items-center">
                <span className="flex h-full items-center justify-center px-3">
                  <BsFillGridFill />
                </span>
                <span className="flex h-full items-center justify-center px-3">
                  <BsListUl />
                </span>
              </div>
            </Switch>
          </div>
        </div>
      </div>

      <Releases
        date={currentDate}
        view={currentView}
        filters={{ publishers: filterPublishers }}
        options={{ setModalOpen, setModalData }}
      />

      <div className="container mx-auto mt-12 px-6">
        <Pagination date={currentDate} options={{ changeDate }} />
      </div>
    </Layout>
  );
}

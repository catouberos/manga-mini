import type { InferGetStaticPropsType } from "next";
import type { ReleasesProps, DateObj } from "@data/index.types";
import type {
  Publication,
  PublicationByDate,
  Publisher,
} from "@data/public.types";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import useSWR from "swr";

import { NextSeo } from "next-seo";
import {
  BsFilter,
  BsColumns,
  BsListUl,
  BsArrowDownShort,
  BsArrowUpShort,
  BsFacebook,
  BsYoutube,
} from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";

import Layout from "@layouts/Layout";

import { ListView, GridView } from "@components/index/View";
import Pagination from "@components/index/Pagination";
import MonthPicker from "@components/index/MonthPicker";

import FilterModal from "@components/index/FilterModal";
import InfoModal from "@components/index/InfoModal";

import Button from "@components/Button";

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
  const { setNearest } = options;

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

  if (!isLoading) {
    // set min as max (of month)
    let min = DateTime.now().daysInMonth as number;

    for (const group of releases) {
      const date = DateTime.fromISO(group.date);
      const today = DateTime.now().startOf("day");

      if (
        // only continue if on current month
        date.month == today.month &&
        // if it's possitive nearest
        date.diffNow("days").days >= 0 &&
        // and smaller than found min
        date.diffNow("days").days < min
      ) {
        min = date.diffNow("days").days;
        setNearest(date.toISODate()!);
      }
    }
  }

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

  const [nearest, setNearest] = useState<string>("");

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

  const jumpToNearest = () => {
    if (currentDate.year != now.year || currentDate.month != now.month)
      changeDate({ year: now.year, month: now.month });

    document.getElementById(nearest)?.scrollIntoView({ behavior: "smooth" });
  };

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
            <MonthPicker date={currentDate} options={{ changeDate }} />
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
              {currentView ? <BsListUl /> : <BsColumns />}
            </Button>
          </div>
        </div>
        <div className="container mx-auto mt-3 flex items-center justify-between px-6">
          <Pagination date={currentDate} options={{ changeDate }} />
          <button
            className="rounded-2xl bg-zinc-200 px-3 py-1 text-lg transition-all duration-150 ease-linear hover:bg-zinc-300"
            onClick={jumpToNearest}
            aria-label="Đổi thứ tự"
            role="button"
          >
            Gần nhất
          </button>
        </div>
      </div>

      <Releases
        date={currentDate}
        view={currentView}
        filters={{ publishers: filterPublishers }}
        order={currentOrder}
        options={{ setModalOpen, setModalData, setNearest }}
      />
    </Layout>
  );
}

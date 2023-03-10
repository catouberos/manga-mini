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
          <p>{"???(?? ??? ?? l|l)/"}</p>
          <h1 className="my-3 text-4xl font-bold">Nani?</h1>
          <p>
            Chuy???n k??? qu??i g?? ???? x???y ra. Vui l??ng t???i l???i trang ho???c li??n h??? b???n
            m??nh nh??.
          </p>
        </div>
      </div>
    );

  if (!isLoading && releases.length == 0)
    return (
      <div className="container mx-auto mt-12 flex items-center justify-center px-3">
        <div className="text-center">
          <p>{"~(>_<~)"}</p>
          <h1 className="my-3 text-4xl font-bold">Kh??ng t??m th???y!</h1>
          <p>C?? th??? l???ch ph??t h??nh th??ng n??y ch??a c??, quay l???i sau nh??!</p>
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
        setNearest(date.toISODate());
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
        title="L???ch ph??t h??nh"
        description="Xem l???ch ph??t h??nh manga/light-novel."
        openGraph={{
          title: `L???ch ph??t h??nh`,
          description: `Xem l???ch ph??t h??nh manga/light-novel t??? c??c nh?? xu???t b???n.`,
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
              L???ch ph??t h??nh
            </span>{" "}
            <MonthPicker date={currentDate} options={{ changeDate }} />
          </div>
          <div className="flex gap-3">
            <Button
              className="rounded-2xl px-2 text-2xl"
              onClick={() => setCurrentOrder((order) => !order)}
              aria-label="?????i th??? t???"
              intent="secondary"
            >
              {currentOrder ? <BsArrowDownShort /> : <BsArrowUpShort />}
            </Button>
            <Button
              className="rounded-2xl px-2 text-2xl"
              onClick={() => setFilterOpen((status) => !status)}
              aria-label="M??? b??? l???c"
              intent="secondary"
            >
              <BsFilter />
            </Button>
            <Button
              className="rounded-2xl px-2 text-2xl"
              onClick={() => changeCurrentView((currentView) => !currentView)}
              aria-label="Thay ?????i layout"
              intent="secondary"
            >
              {currentView ? <BsListUl /> : <BsColumns />}
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
          <button
            className="rounded-2xl bg-zinc-200 py-1 px-3 text-lg transition-all duration-150 ease-linear hover:bg-zinc-300"
            onClick={jumpToNearest}
            aria-label="?????i th??? t???"
            role="button"
          >
            G???n nh???t
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

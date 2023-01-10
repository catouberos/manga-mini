// // Generates `/posts/1` and `/posts/2`
// export async function getStaticPaths() {
//   return {
//     paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
//     fallback: false, // can also be true or 'blocking'
//   };
// }

import Layout from "@layouts/Layout";
import { getSerie, getSeries, getSeriesId } from "@lib/supabase";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import {
  BsBookmarkCheck,
  BsPencilSquare,
  BsCalendarCheck,
  BsCalendar2CheckFill,
} from "react-icons/bs";
import { DateTime } from "luxon";
import Cover from "@components/Cover";
import Card from "@components/Card";
import Badge from "@components/Badge";

interface SerieReleasesView {
  data:
    | {
        id: string;
        name: string;
        date: string;
        edition: string | null;
        price: number;
        image_url: string | null;
      }[]
    | null;
}

const ListView = ({ data }: SerieReleasesView) => (
  <div className="mx-auto mb-12 overflow-scroll lg:container">
    <div className="min-w-fit px-6">
      <div className="grid min-w-max grid-cols-6 overflow-hidden rounded-2xl border dark:border-zinc-600">
        <span className="border-r p-3 text-center font-bold dark:border-zinc-600 dark:bg-zinc-700">
          Ngày phát hành
        </span>
        <span className="col-span-4 p-3 font-bold dark:bg-zinc-700">Tên</span>
        <span className="p-3 font-bold dark:bg-zinc-700">Giá</span>
        {data?.map((entry) => {
          const date = DateTime.fromISO(entry.date);
          const today = DateTime.now();

          return (
            <>
              <div className="flex h-full items-center justify-center border-t border-r p-3 font-bold dark:border-zinc-600">
                <span>{date.toFormat("dd/MM/yyyy")}</span>
                {date < today && (
                  <BsCalendar2CheckFill className="ml-3 inline-block align-baseline text-green-200" />
                )}
              </div>
              <div className="col-span-4 flex items-center gap-3 border-t p-3 decoration-primary decoration-2 dark:border-zinc-600">
                <span>{entry.name}</span>
                {entry.edition && (
                  <Badge className="m-0 bg-amber-200/75 backdrop-blur-md">
                    {entry.edition}
                  </Badge>
                )}
              </div>
              <span className="border-t p-3 dark:border-zinc-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(entry.price)}
              </span>
            </>
          );
        })}
      </div>
    </div>
  </div>
);

const CoverView = ({ data }: SerieReleasesView) => (
  <div className="grid grid-cols-2 gap-6 px-6 md:grid-cols-4 lg:grid-cols-6">
    {data?.map((entry) => (
      <Card key={entry.id} clickable={false}>
        {entry.edition && (
          <Badge className="absolute top-0 right-0 bg-amber-200/75 backdrop-blur-md">
            {entry.edition}
          </Badge>
        )}
        <Cover entry={entry} sizes="(max-width: 768px) 40vw, 200px" />
      </Card>
    ))}
  </div>
);

export const getStaticPaths = async () => {
  let series = await getSeriesId();

  return {
    paths: series.map((serie) => ({ params: { id: String(serie.id) } })),
    fallback: false,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const data = await getSerie(parseInt(context.params!.id as string));
  let status = 1;
  let image_url = null;

  const date_difference = DateTime.now().diff(
    DateTime.fromISO(data.licensed!.timestamp),
    "days"
  ).days;

  // has entries
  if (Array.isArray(data.publication) && data.publication.length > 0) {
    if (date_difference > 0) {
      status = 2;
    } else {
      status = 3;
    }

    image_url =
      data.publication[0].image_url || data.licensed!.image_url || null;
  }

  return {
    props: {
      data: {
        ...data,
        id: String(data.id),
        licensed: {
          ...data.licensed,
          date_difference: date_difference.toFixed(0),
        },
        image_url,
      },
      status,
    },
  };
};

export default function Serie({
  data,
  status,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { publication, licensed, publisher } = data;

  console.log(data);

  return (
    <Layout>
      <div className="relative mb-12">
        <div className="absolute inset-0 bottom-1/4 bg-zinc-100 shadow-[inset_0_0_1rem_0_rgba(0,0,0,0.1)] dark:bg-zinc-900"></div>
        <div className="container relative mx-auto flex flex-col-reverse gap-6 p-6 sm:flex-row sm:gap-12">
          <div className="overflow-hidden rounded-2xl shadow-md transition-shadow duration-150 ease-linear hover:shadow-lg sm:basis-72">
            <Cover
              loader={false}
              entry={data}
              fit="full"
              sizes="(max-width: 768px) 80vw, (max-width: 1024px) 25vw, 15vw"
            />
          </div>
          <div className="sm:flex-1 sm:pt-20">
            <h2 className="mb-6 font-kanit text-4xl font-bold">{data.name}</h2>
            <p>
              <b>Nhà xuất bản/phát hành</b>: {data.publisher!.name}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="mx-auto mb-12 grid grid-cols-3 text-center">
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-300 p-3 text-xl dark:bg-green-700">
              <BsPencilSquare />
            </div>
            <span className="mt-3">Đã mua bản quyền</span>
          </div>
          <div
            className={`${
              status >= 2
                ? "before:bg-green-300 dark:before:bg-green-700"
                : "before:bg-zinc-200 dark:before:bg-zinc-700"
            } relative flex flex-col items-center before:absolute before:left-[calc(-50%+2.25rem)] before:top-6 before:h-1 before:w-[calc(100%-4.5rem)] `}
          >
            <div
              className={`${
                status >= 2
                  ? "bg-green-300 dark:bg-green-700"
                  : "bg-zinc-200 dark:bg-zinc-700"
              } flex h-14 w-14 items-center justify-center rounded-full  p-3 text-xl`}
            >
              <BsCalendarCheck />
            </div>
            <span className="mt-3">Đã có lịch phát hành</span>
          </div>
          <div
            className={`${
              status >= 3
                ? "before:bg-green-300 dark:before:bg-green-700"
                : "before:bg-zinc-200 dark:before:bg-zinc-700"
            } relative flex flex-col items-center before:absolute before:left-[calc(-50%+2.25rem)] before:top-6 before:h-1 before:w-[calc(100%-4.5rem)] `}
          >
            <div
              className={`${
                status >= 3
                  ? "bg-green-300 dark:bg-green-700"
                  : "bg-zinc-200 dark:bg-zinc-700"
              } flex h-14 w-14 items-center justify-center rounded-full p-3 text-xl`}
            >
              <BsBookmarkCheck />
            </div>
            <span className="mt-3">Đã phát hành</span>
          </div>
        </div>

        <h3 className="mb-6 px-6 font-kanit text-2xl font-bold">
          Thông tin bản quyền
        </h3>
        <p className="mb-12 px-6">
          Bộ truyện được mua bản quyền bởi <b>{data.publisher!.name}</b> ngày{" "}
          <b>{DateTime.fromISO(licensed.timestamp!).toLocaleString()}</b>.{" "}
          {status == 1 && (
            <>
              Hiện tại đã được... <b>{licensed.date_difference} ngày</b> kể từ
              hôm ấy o(TヘTo)
            </>
          )}
        </p>

        {status >= 2 && (
          <>
            <h3 className="mb-6 px-6 font-kanit text-2xl font-bold">
              Lịch phát hành
            </h3>
            <ListView data={publication} />

            <h3 className="mb-6 px-6 font-kanit text-2xl font-bold">Ảnh bìa</h3>
            <CoverView data={data.publication} />
          </>
        )}
      </div>
    </Layout>
  );
}

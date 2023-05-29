import type { ReleasesView } from "@data/index.types";

import { DateTime } from "luxon";

import { BsBoxArrowUpRight, BsCalendar2CheckFill } from "react-icons/bs";

import { VND } from "@data/config";

import Badge from "@components/Badge";
import Card from "@components/Card";
import Cover from "@components/Cover";

export const GridView = ({ releases, isLoading, options }: ReleasesView) => {
  const { setModalOpen, setModalData } = options;

  if (isLoading)
    return (
      <>
        {[...Array(8)].map((_, i) => {
          return (
            <div className="container mx-auto animate-pulse px-6" key={i}>
              <div className="mb-6 mt-12 flex items-center text-xl font-bold">
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
            <div
              className="mb-3 mt-12 flex scroll-mt-48 items-center text-xl font-bold"
              id={date.toISODate()!}
            >
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
                    <Badge
                      intent="none"
                      className="absolute right-0 top-0 bg-amber-200/75 backdrop-blur-md"
                    >
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

export const ListView = ({ releases, isLoading, options }: ReleasesView) => {
  const { setModalOpen, setModalData } = options;

  if (isLoading)
    return (
      <div className="mx-auto overflow-auto lg:container">
        <div className="min-w-fit px-6">
          <table className="mt-12 w-full min-w-fit animate-pulse overflow-hidden border">
            <thead className="font-bold">
              <tr>
                <th className="w-40 border-r p-3">Ngày phát hành</th>
                <th className="w-full p-3 text-left">Tên</th>
                <th className="p-3 text-left">Giá</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_) => {
                return (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-t">
                        {i === 0 && (
                          <td rowSpan={5} className="whitespace-nowrap p-3">
                            <div className="h-5 rounded bg-zinc-300"></div>
                          </td>
                        )}
                        <td className="whitespace-nowrap border-l p-3">
                          <div className="h-5 w-2/3 rounded bg-zinc-300"></div>
                        </td>
                        <td className="whitespace-nowrap p-3">
                          <div className="h-5 w-28 rounded bg-zinc-300"></div>
                        </td>
                      </tr>
                    ))}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );

  return (
    <div className="mx-auto overflow-auto lg:container">
      <div className="min-w-fit px-6">
        <table className="mt-12 w-full min-w-fit overflow-hidden border">
          <thead className="font-bold">
            <tr>
              <th className="whitespace-nowrap border-r p-3">Ngày phát hành</th>
              <th className="w-full p-3 text-left">Tên</th>
              <th className="p-3 text-left">Giá</th>
            </tr>
          </thead>
          <tbody>
            {releases.map((releaseGroup) => {
              const date = DateTime.fromISO(releaseGroup.date);
              const today = DateTime.now();

              return (
                <>
                  {releaseGroup.entries.map((release, i) => (
                    <tr
                      key={release.id}
                      className="scroll-mt-48 border-t"
                      id={date.toISODate()!}
                    >
                      {i === 0 && (
                        <td
                          rowSpan={releaseGroup.entries.length}
                          className="whitespace-nowrap p-3 font-bold"
                        >
                          <div className="flex h-full items-center justify-center">
                            <span>{date.toFormat("dd/MM/yyyy")}</span>
                            {date < today && (
                              <BsCalendar2CheckFill className="ml-3 inline-block align-baseline text-green-700" />
                            )}
                          </div>
                        </td>
                      )}
                      <td
                        className="cursor-pointer gap-3 whitespace-nowrap border-l p-3 decoration-primary decoration-2 hover:underline"
                        onClick={() => {
                          setModalData(release);
                          setModalOpen(true);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span>{release.name}</span>
                          {release.edition && (
                            <Badge
                              className="bg-amber-200/75 backdrop-blur-md"
                              intent="none"
                            >
                              {release.edition}
                            </Badge>
                          )}
                          <BsBoxArrowUpRight className="inline-block text-zinc-400" />
                        </div>
                      </td>
                      <td className="whitespace-nowrap p-3">
                        {VND.format(release.price)}
                      </td>
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

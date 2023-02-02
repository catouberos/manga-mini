import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function Releases(req: NextRequest) {
  const { method } = req;

  switch (method) {
    case "GET":
      const { searchParams } = new URL(req.url);

      const start =
        searchParams.get("start") ??
        DateTime.now().startOf("month").toISODate();
      const end =
        searchParams.get("end") ?? DateTime.now().endOf("month").toISODate();
      const order = searchParams.get("order");

      const publisher = searchParams.getAll("publisher");

      let url = `https://manga.glhf.vn/api/releases?start=${start}&end=${end}&order=${order}`;

      if (publisher.length > 0)
        publisher.map((publisher) => (url += `&publisher=${publisher}`));

      const apiRes = await fetch(url);
      const entries = await apiRes.json();

      if (entries) {
        // Get data from your database
        return new NextResponse(JSON.stringify(entries), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "cache-control":
              "public, s-maxage=7200, stale-while-revalidate=600",
          },
        });
      } else {
        return new NextResponse(null, {
          status: 204,
        });
      }
    default:
      return new NextResponse(undefined, {
        status: 405,
      });
  }
}

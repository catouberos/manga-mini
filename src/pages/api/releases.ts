import type { NextApiRequest, NextApiResponse } from "next";
import { DateTime } from "luxon";

export default async function Releases(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: {
      start = DateTime.now().startOf("month").toISODate(),
      end = DateTime.now().endOf("month").toISODate(),
      publisher,
      order,
    },
    method,
  } = req;

  switch (method) {
    case "GET":
      let url = `https://manga.glhf.vn/api/releases?start=${start}&end=${end}&order=${order}`;

      if (Array.isArray(publisher))
        publisher.map((publisher) => (url += `&publisher=${publisher}`));
      else if (publisher) url += `&publisher=${publisher}`;

      const apiRes = await fetch(url);
      const entries = await apiRes.json();

      if (entries) {
        // Get data from your database, also cache on Vercel's network for 2 hours
        res.setHeader("Cache-Control", "max-age=0, s-maxage=7200");
        res.status(200).json(entries);
      } else {
        res.status(204).end();
      }

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

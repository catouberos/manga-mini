import { BsFacebook, BsArrowUp, BsYoutube } from "react-icons/bs";

export default function Footer() {
  const handleClick = () => {
    document.getElementById("__next")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="container mx-auto mt-6 p-6">
      <hr className="mb-6 w-24 border-4 border-zinc-400" />
      <div className="flex flex-col justify-between gap-6 sm:flex-row">
        <div>
          <ul className="flex gap-3 text-2xl text-zinc-400">
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
          </ul>
        </div>
        <div className="flex flex-row justify-end gap-6 text-zinc-400">
          <ul className="flex flex-row gap-6">
            <li>
              <a
                href="https://manga.glhf.vn"
                className="transition-all ease-linear hover:text-[#f8b60b]"
              >
                Supported by GLHF
              </a>
            </li>
            <li>
              <a
                href="mailto:konnichiwa@glhf.vn"
                className="transition-all ease-linear hover:text-zinc-600"
              >
                Báo lỗi
              </a>
            </li>
          </ul>
          <BsArrowUp
            onClick={handleClick}
            className="cursor-pointer text-2xl transition-all ease-linear hover:text-zinc-600"
          />
        </div>
      </div>
    </div>
  );
}

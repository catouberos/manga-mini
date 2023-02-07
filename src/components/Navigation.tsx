import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { BsFacebook, BsYoutube } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";
import { slide as Menu } from "react-burger-menu";
import { Squash as Hamburger } from "hamburger-react";

const MobileMenu = () => {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false); // Close the navigation panel on changing page
  }, [router.pathname]);

  return (
    <>
      <Menu
        isOpen={menuOpen}
        onStateChange={(state) => setMenuOpen(state.isOpen)}
        customBurgerIcon={false}
        width={"80%"}
        right
      >
        <a href="https://truyenbanquyen.com/" className="bm-item">
          Trang chủ
        </a>
        <a href="https://truyenbanquyen.com/wiki/" className="bm-item">
          Wiki
        </a>
        <hr className="bm-divider w-12 border-4 border-zinc-400" />
        <ul className="bm-social" style={{ display: "flex" }}>
          <a
            href="https://facebook.com/mangaglhf/"
            className="transition-colors duration-100 ease-linear hover:text-[#1877f2]"
            aria-label="Facebook"
          >
            <BsFacebook />
          </a>
          <a
            href="https://www.youtube.com/c/truyenbanquyen"
            className="transition-colors duration-100 ease-linear hover:text-[#ff0000]"
            aria-label="YouTube"
          >
            <BsYoutube />
          </a>
          <a
            href="https://tiktok.com/@mi.manga.life"
            className="transition-colors duration-100 ease-linear hover:text-black"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>
        </ul>
      </Menu>

      {/* open menu on mobile */}
      <div
        className={`fixed top-4 right-4 z-[1200] sm:hidden ${
          menuOpen ? "text-zinc-50" : "text-zinc-800"
        }`}
      >
        <Hamburger
          size={24}
          toggled={menuOpen}
          toggle={() => setMenuOpen(!menuOpen)}
          label="Mở menu"
          rounded
        />
      </div>
    </>
  );
};

const DesktopMenu = () => {
  return (
    <div className="hidden sm:block">
      <ul className="flex items-center gap-3 font-bold text-zinc-500">
        <li>
          <a
            href="https://truyenbanquyen.com/"
            className="transition-colors duration-100 ease-linear hover:text-zinc-700"
          >
            Trang chủ
          </a>
        </li>
        <li>
          <a
            href="https://truyenbanquyen.com/wiki/"
            className="transition-colors duration-100 ease-linear hover:text-zinc-700"
          >
            Wiki
          </a>
        </li>
        <li>
          <a
            href="https://fb.com/truyenbanquyen/"
            className="text-2xl transition-colors duration-100 ease-linear hover:text-[#1877f2]"
            aria-label="Facebook"
          >
            <BsFacebook />
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/c/truyenbanquyen"
            className="text-2xl transition-colors duration-100 ease-linear hover:text-[#ff0000]"
            aria-label="YouTube"
          >
            <BsYoutube />
          </a>
        </li>
        <li>
          <a
            href="https://tiktok.com/@mi.manga.life"
            className="text-2xl transition-colors duration-100 ease-linear hover:text-black"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default function Navigation() {
  return (
    <>
      <div className="fixed top-0 z-20 h-20 w-full">
        <div className="container mx-auto flex h-full items-center justify-between px-6">
          {/* logo */}
          <div className="flex items-center gap-3 text-zinc-500">
            <a href="https://truyenbanquyen.com/">
              <Image
                src="/img/truyenbanquyen.png"
                width={48}
                height={48}
                alt="GLHF logo"
              />
            </a>
            {"|"}
            <a href="https://manga.glhf.vn">
              <Image
                src="/img/glhf.png"
                width={64}
                height={32}
                alt="GLHF logo"
              />
            </a>
          </div>

          <DesktopMenu />
        </div>
      </div>
      <MobileMenu />
    </>
  );
}

import { Link } from "react-router";
import { HiHome } from "react-icons/hi";
import { HiShoppingBag } from "react-icons/hi2";
import { IoGameController } from "react-icons/io5";

export default function Aside() {
  const baseIconClassName =
    "text-5xl text-accent-1 hover:text-accent-1h duration-150";
  const links = [
    {
      icon: (className: string) => (
        <HiHome className={`${className} ${baseIconClassName}`} />
      ),
      title: "Home",
      to: "/",
    },
    {
      icon: (className: string) => (
        <HiShoppingBag className={`${className} ${baseIconClassName}`} />
      ),
      title: "Cart",
      to: "/",
    },
    {
      icon: (className: string) => (
        <IoGameController className={`${className} ${baseIconClassName}`} />
      ),
      title: "Games",
      to: "/",
    },
  ];

  return (
    <aside className="p-4 h-svh">
      <div className="bg-item-1 p-6 rounded-2xl h-full">
        <div className="flex flex-col">
          {links.map((el) => (
            <Link key={`aside-link-${el.to}`} to={el.to} className="pb-6">
              <div className="group relative">
                {el.icon("absolute group-hover:blur-[3px] duration-150")}
                {el.icon("relative")}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

import Link from "next/link";
import { DrawCurrent } from "./DrawCurrent";
import Image from "next/image";
import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import Button from "~/components/Button";
import { DrawHistory } from "./DrawHistory";
import { HowItWorks } from "./HowItWorks";
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  DocumentChartBarIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

import {
  GiTakeMyMoney,
  GiMoneyStack,
  GiPayMoney,
  GiReceiveMoney,
} from "react-icons/gi";
import { RiStockLine } from "react-icons/ri";
import { IoCreateOutline } from "react-icons/io5";

const navitems = [
  {
    name: "Lottery",
    description: "Get a better understanding of your traffic",
    href: "lotto",
    icon: GiTakeMyMoney,
  },
  {
    name: "Wallet",
    description: "Connect with third-party tools and find out expectations",
    href: "wallet",
    icon: GiMoneyStack,
  },
  {
    name: "Mint",
    description: "Speak directly to your customers with our engagement tool",
    href: "mint",
    icon: IoCreateOutline,
  },
  {
    name: "Trade",
    description: "Build strategic funnels that will convert",
    href: "trade",
    icon: RiStockLine,
  },
  {
    name: "Buy",
    description: "Your customers' data will be safe and secure",
    href: "#",
    icon: GiPayMoney,
  },
  {
    name: "Sell",
    description: "Edit, manage and create newly informed decisions",
    href: "#",
    icon: GiReceiveMoney,
  },
];

export function HomePage() {
  return (
    <div className="flex flex-col gap-5 bg-gray-50 dark:bg-neutral-950">
      {/* <div>
        <Image
          height={1200 * 2}
          width={1200 * 2}
          src="/assets/images/solcitylogo2.png"
          alt=""
        />
      </div> */}
      <div className=" max-w-md flex-auto overflow-hidden  text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 lg:max-w-3xl">
        <div className="grid grid-cols-1 gap-x-6 gap-y-1 p-4 lg:grid-cols-2">
          {navitems.map((item) => (
            <div
              key={item.name}
              className=" relative  m-5 ml-10 mr-10 rounded-lg p-0 text-center "
            >
              <div className="mt-1  items-center rounded-lg border border-emerald-700 bg-emerald-500 p-5 text-center hover:bg-emerald-300">
                {/* <item.icon
                  className="h-6  w-full text-center text-emerald-500 hover:text-emerald-700"
                  aria-hidden="true"
                /> */}

                <div className="text-black">
                  <a
                    href={item.href}
                    className="font-semibold text-gray-800 hover:text-gray-900"
                  >
                    {item.name}
                    <span className="absolute inset-0" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

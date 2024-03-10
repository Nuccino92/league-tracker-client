"use client";

import { Listbox, Transition } from "@headlessui/react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useState, Fragment } from "react";
import cryptoRandomString from "crypto-random-string";
import classNames from "classnames";
import Link from "next/link";

type RequestTypes = {
  dates: Array<{
    label: string;
    key: string;
    current: boolean;
  }>;
  scheduleData: Array<{
    key: string;
    gameInfo: {
      played: boolean;
      date: string;
    };
    teamInfo: {
      home: {
        name: string;
        score: number | null;
      };
      away: {
        name: string;
        score: number | null;
      };
    };
  }>;
};

type SchduledGameStats = {
  gameInfo: {
    played: boolean;
    date: string;
  };
  teamInfo: {
    home: {
      name: string;
      score: number | null;
    };
    away: {
      name: string;
      score: number | null;
    };
  };
};

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1280 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 750, min: 464 },
    items: 1,
  },
};
export default function ScheduleBar() {
  const [scheduledGames, setScheduledGames] = useState(
    scheduleGetRequestData.scheduleData
  );
  const [daysAvailable, setDaysAvailable] = useState(
    scheduleGetRequestData.dates
  );

  const [selectedDay, setSelectedDay] = useState(
    scheduleGetRequestData.dates[1]
  );

  const carouselDataToRender = scheduledGames.filter(
    (game) => selectedDay.key === game.key
  );

  return (
    <div className=" bg-slate-100 md:flex hidden items-center justify-center space-x-2">
      <Listbox
        value={selectedDay}
        onChange={setSelectedDay}
        as="div"
        className="relative inline-block text-left w-[120px]"
      >
        <div>
          <Listbox.Button
            id="schedule-date-select"
            className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 space-x-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            <span>{selectedDay.label}</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </Listbox.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Listbox.Options className="absolute left-0 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            {daysAvailable.map((day) => {
              return (
                <div
                  className="px-1 py-1"
                  key={cryptoRandomString({ length: 10 })}
                >
                  <Listbox.Option value={day}>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-secondary text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {day.label}
                      </button>
                    )}
                  </Listbox.Option>
                </div>
              );
            })}
          </Listbox.Options>
        </Transition>
      </Listbox>
      <div className="xl:max-w-[900px] md:max-w-[500px] max-w-[250px] w-full mx-auto bg-white">
        <Carousel
          // could use ssr
          arrows={false}
          renderButtonGroupOutside={true}
          customButtonGroup={<ButtonGroup />}
          // ref={(el) => el?.goToSlide(4)} TODO: get from fetched data
          responsive={responsive}
          itemClass="border w-full bg-white"
          containerClass="relative bg-slate-100"
          sliderClass="relative ml-10"
        >
          {carouselDataToRender.map((stats) => {
            return (
              <CarouselItem
                stats={stats}
                key={cryptoRandomString({ length: 10 })}
              />
            );
          })}
        </Carousel>
      </div>{" "}
    </div>
  );
}

function CarouselItem({ stats }: { stats: SchduledGameStats }) {
  const [hovered, setHovered] = useState(false);
  const winningTeam = stats.gameInfo.played
    ? stats.teamInfo.home.score &&
      stats.teamInfo.away.score &&
      stats.teamInfo.home.score > stats.teamInfo.away.score
      ? "home"
      : "away"
    : null;

  return (
    <div
      onMouseEnter={() => stats.gameInfo.played && setHovered(true)}
      onMouseLeave={() => stats.gameInfo.played && setHovered(false)}
    >
      <div className="text-xs space-y-1 py-2 px-2">
        <div className="flex justify-between">
          <div className="flex items-center space-x-1.5">
            {/* {stats.homeTeam.avatar.logo
            ? null
            :  <div
                style={{ backgroundColor: stats.homeTeam.avatar.bg ?? "" }}
                className="h-4 w-4 text-white text-center"
              >
                {" "}
                {stats.homeTeam.name.charAt(0)}
              </div>
              null} */}
            <span
              style={{ fontWeight: winningTeam === "home" ? "bold" : "normal" }}
            >
              {stats.teamInfo.home.name}
            </span>
          </div>
          <span
            style={{ fontWeight: winningTeam === "home" ? "bold" : "normal" }}
          >
            {stats.teamInfo.home.score ?? "TBD"}
          </span>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center space-x-1.5">
            {/* {stats.awayTeam.avatar.logo
            ? null
            :  <div
                style={{ backgroundColor: stats.awayTeam.avatar.bg ?? "" }}
                className="h-4 w-4 text-white text-center"
              >
                {stats.awayTeam.name.charAt(0)}
              </div>
              null} */}
            <span
              style={{ fontWeight: winningTeam === "away" ? "bold" : "normal" }}
            >
              {stats.teamInfo.away.name}
            </span>
          </div>
          <span
            style={{ fontWeight: winningTeam === "away" ? "bold" : "normal" }}
          >
            {stats.teamInfo.away.score ?? "TBD"}
          </span>
        </div>
        <div className="text-center font-bold">{stats.gameInfo.date}</div>
      </div>

      <Transition
        show={hovered && stats.gameInfo.played}
        as={"div"}
        enter="transition-all ease-out duration-100"
        enterFrom="transform -translate-y-full"
        enterTo="transform translate-y-0"
        leave="transition-all ease-in duration-100"
        leaveFrom="transform translate-y-0"
        leaveTo="transform -translate-y-full"
        className="absolute bottom-0 left-0 w-full h-full z-10 bg-slate-100  transition-all"
      >
        <Link
          href="#"
          className="w-full h-full flex items-center justify-center text-xs font-bold shadow-lg rounded-md"
        >
          <span className="px-3 bg-secondary text-white rounded-xl h-8 flex items-center justify-center border-primary">
            View game page
          </span>
        </Link>{" "}
      </Transition>
    </div>
  );
}

// replace with this, put buttons outside
const ButtonGroup = ({ next, previous, goToSlide, ...rest }: any) => {
  const {
    carouselState: { currentSlide },
  } = rest;
  return (
    <div className="md:flex hidden justify-between relative h-0 ">
      <button
        className={classNames(
          currentSlide === 0 ? "hidden" : "",
          "absolute -mt-[77px] w-10 h-[77px] left-0 bg-slate-100 flex items-center justify-center border-l-2"
        )}
        onClick={() => previous()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        className="absolute -mt-[77px] -mr-10 w-10 h-[77px] right-0 bg-slate-100 flex items-center justify-center border-r-2"
        onClick={() => next()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
};

const scheduleGetRequestData: RequestTypes = {
  dates: [
    {
      label: "AUG 10",
      key: "aug-10",
      current: false,
    },
    {
      label: "AUG 11",
      key: "aug-11",
      current: true,
    },

    {
      label: "AUG 12",
      key: "aug-12",
      current: false,
    },
  ],
  scheduleData: [
    {
      key: "aug-10",
      gameInfo: {
        played: true,
        date: "SAT AUG 10 @ 8:30 PM",
      },
      teamInfo: {
        home: {
          name: "Toronto",
          score: 88,
        },
        away: {
          name: "Dallas",
          score: 77,
        },
      },
    },
    {
      key: "aug-10",
      gameInfo: {
        played: true,
        date: "SAT AUG 10 @ 8:30 PM",
      },
      teamInfo: {
        home: {
          name: "Chicago",
          score: 68,
        },
        away: {
          name: "Denver",
          score: 108,
        },
      },
    },
    {
      key: "aug-10",
      gameInfo: {
        played: true,
        date: "SAT AUG 10 @ 8:30 PM",
      },
      teamInfo: {
        home: {
          name: "New York",
          score: 91,
        },
        away: {
          name: "Philadelphia ",
          score: 89,
        },
      },
    },
    {
      key: "aug-11",
      gameInfo: {
        played: true,
        date: "SAT AUG 11 @ 8:30 PM",
      },
      teamInfo: {
        home: {
          name: "Brooklyn",
          score: 104,
        },
        away: {
          name: "Boston",
          score: 101,
        },
      },
    },
    {
      key: "aug-11",
      gameInfo: {
        played: true,
        date: "SAT AUG 11 @ 8:30 PM",
      },
      teamInfo: {
        home: {
          name: "Portland",
          score: 99,
        },
        away: {
          name: "Atlanta",
          score: 98,
        },
      },
    },
    {
      key: "aug-11",
      gameInfo: {
        played: true,
        date: "SAT AUG 11 @ 8:30 PM",
      },
      teamInfo: {
        home: {
          name: "Los Angeles",
          score: 95,
        },
        away: {
          name: "Indiana",
          score: 90,
        },
      },
    },
    {
      key: "aug-12",
      gameInfo: {
        played: false,
        date: "SAT AUG 12 @ 8:30 PM",
      },
      teamInfo: {
        home: {
          name: "Toronto",
          score: null,
        },
        away: {
          name: "Dallas",
          score: null,
        },
      },
    },
    {
      key: "aug-12",
      gameInfo: {
        played: false,
        date: "SAT AUG 11 @ 8:30 PM",
      },
      teamInfo: {
        home: {
          name: "Toronto",
          score: null,
        },
        away: {
          name: "Dallas",
          score: null,
        },
      },
    },
  ],
};

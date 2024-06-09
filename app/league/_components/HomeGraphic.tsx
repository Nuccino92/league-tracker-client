'use client';

import Image from 'next/image';
import leagueLogo from '@/app/assets/fake-logo.png';
import Carousel from 'react-multi-carousel';
import cryptoRandomString from 'crypto-random-string';
import Link from 'next/link';
import ROUTES from '@/app/lib/globals/routes';
import { usePathname } from 'next/navigation';

const responsive = {
  any: {
    breakpoint: { max: 4000, min: 464 },
    items: 1,
  },
};

export default function HomeGraphic() {
  const pathname = usePathname();

  return (
    <div className='max-w-[700px] rounded border border-violet-100 p-4 shadow-md'>
      <div className='pb-10'>
        <>
          <div className='flex h-[400px] items-center justify-center'>
            <div className='flex h-full w-full items-center justify-center rounded-md bg-primary pb-8'>
              <div className='flex flex-col items-center space-y-4'>
                <div>
                  {graphicData.logo ? (
                    <Image
                      height={100}
                      width={100}
                      src={graphicData.logo}
                      alt={graphicData.leagueName + 'Logo'}
                    />
                  ) : null}
                </div>
                <div className='text-center text-5xl font-bold text-white'>
                  {graphicData.leagueName}
                </div>
              </div>
            </div>
          </div>
          <div className='py-4'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-slate-600'>
                {graphicData.date}
              </span>
              <Link
                href={`${pathname}/${ROUTES.ABOUT}`}
                className='mb-4 mt-2 text-3xl font-bold transition-all hover:underline'
              >
                {graphicData.headline}
              </Link>
              <div className='text-sm text-slate-600 '>
                {graphicData.description}{' '}
                <Link
                  href={`${pathname}/${ROUTES.ABOUT}`}
                  className='font-medium text-primary hover:underline'
                >
                  Click here to read more.
                </Link>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}

//TODO: make it a list of games at the bottom, the header stays what it was

const graphicData = {
  logo: leagueLogo,
  leagueName: "Anthony's Basketball League", // //TODO get from useLeague() hook
  date: 'July 31 2023',
  headline: "Anthony's Basketball League",
  description:
    "Anthony's Basketball League is a basketball league that was created on July 31, 2023. The league has 14 teams and it's current owner is John Smith.",
  type: 'league',
};
// {
//   logo: leagueLogo,
//   teams: {
//     home: { name: "Brooklyn", score: 104 },
//     away: { name: "Boston", score: 101 },
//   },
//   date: "Aug 22 2023",
//   gameID: "32432424",
//   description:
//     "On Aug 22 2023 a game was played between Brooklyn and Boston. Brooklyn won the game with the final score being 104-101",
//   type: "game",
// },
// game graphic

/* <>
<div className="h-[400px] flex items-center justify-center">
  <div className="bg-secondary relative square h-full w-full rounded-md flex items-center justify-center pb-8 text-5xl font-medium text-white">
    <div className="absolute top-0 left-0 ml-10 mt-10 flex items-center justify-center flex-col space-y-2">
      <span>{data.teams?.home.name}</span>
      <span className="text-3xl">
        ({data.teams?.home.score})
      </span>
    </div>
    <div className="z-10 bg-secondary absolute inset-0 m-auto w-[125px] h-[125px] flex items-center justify-center text-6xl rounded-full">
      VS
    </div>
    <div className="absolute bottom-0 right-0 mr-10 mb-10 flex items-center justify-center flex-col space-y-2">
      <span>{data.teams?.away.name}</span>{" "}
      <span className="text-3xl">
        ({data.teams?.away.score})
      </span>
    </div>
  </div>
</div>
<div className="py-4">
  <div className="flex flex-col">
    <span className="font-medium text-slate-600 text-sm">
      {data.date}
    </span>
    <Link
      href="#" // TODO: swap to data.href
      className="text-3xl font-bold hover:underline transition-all mt-2 mb-4"
    >
      {data.headline}
    </Link>
    <div className="text-sm text-slate-600 ">
      {data.description}{" "}
      <Link
        href={`${ROUTES.GAME}/${data.gameID}`} // TODO: swap to data.href
        className="text-secondary font-medium hover:underline"
      >
        Click here to read more.
      </Link>
    </div>
  </div>
</div>
</> */

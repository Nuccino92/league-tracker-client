import cryptoRandomString from 'crypto-random-string';

type Props = {
  powerRankingData: {
    [key: number]: {
      name: string;
      wins: number;
      losses: number;
      streak: number;
    };
  };
};

export default function PowerRanking({ powerRankingData }: Props) {
  return (
    <div className=' text-sm text-slate-900'>
      <div className='mb-2 text-base font-medium'>Power rankings</div>
      <div className='space-y-1'>
        {Object.values(powerRankingData).map((team, index) => {
          return (
            <div
              key={cryptoRandomString({ length: 10 })}
              className='flex items-center justify-between'
            >
              <div>
                <span className='font-medium'>{index + 1}.</span>{' '}
                <span className='font-medium'>{team.name}</span>{' '}
                <span className='mx-4 text-xs'>{`(${team.wins} - ${team.losses})`}</span>
              </div>
              <div
                className=''
                style={{
                  color:
                    team.streak >= 1
                      ? '#22D91D'
                      : team.streak < 0
                        ? 'red'
                        : 'black',
                }}
              >
                {team.streak >= 1
                  ? `W - ${team.streak}`
                  : team.streak < 0
                    ? `L - ${Math.abs(team.streak)}`
                    : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

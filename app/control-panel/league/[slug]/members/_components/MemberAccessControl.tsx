import { SVGProps } from 'react';

import FormLabel from '@/app/control-panel/_components/FormLabel';
import { MemberRole } from '@/app/lib/types/Models/Member';
import { cn } from '@/app/lib/utils';
import {
  FeatureAccess,
  useLeagueControlPanel,
} from '@/app/control-panel/_components/LeagueControlPanelProvider';

interface AccessControlProps {
  role: MemberRole;
}

const FEATURE_DESCRIPTIONS = {
  dashboard: {
    title: 'Dashboard',
    description:
      'Access to Dasbhoard page with view of select contents not restricted to owner',
  },
  members: {
    title: 'Members',
    description: "Access to Members page and it's features",
  },
  seasons: {
    title: 'Seasons',
    description: "Access to Seasons page and it's features",
  },
  teams: {
    title: 'Teams',
    description: 'Access to Teams page Calendar feature',
  },
  players: {
    title: 'Players',
    description: "Access to Players page and it's features",
  },
  schedule: {
    title: 'Schedule',
    description: "Access to Schedule page and it's features",
  },
  registrations: {
    title: 'Registrations',
    description: "Access to Registrations page and it's features",
  },
  notices: {
    title: 'Notices',
    description: "Access to Notices page and it's features",
  },
  settings: {
    title: 'Settings',
    description: 'Access to change league information inside settings page',
  },
  submitScore: {
    title: 'Submit Game Score',
    description: 'Access to the score submission tool',
  },
};

const MemberAccessControl: React.FC<AccessControlProps> = ({ role }) => {
  const { rolePermissions } = useLeagueControlPanel();

  return (
    <div className=''>
      <div className='mb-4 mt-4 border-b pb-2'>
        <FormLabel
          classes='text-sm font-bold'
          label='Control Panel Access'
          htmlFor=''
        />
      </div>

      <div className='space-y-2'>
        {Object.entries(rolePermissions[role]).map(([feature, hasAccess]) => {
          return (
            <div
              key={feature}
              className={cn(feature === 'submitScore' && '!mt-4 border-t pt-4')}
            >
              <div className='flex items-start justify-between'>
                <div className='flex flex-col'>
                  <div>
                    {FEATURE_DESCRIPTIONS[feature as keyof FeatureAccess].title}
                  </div>
                  <p className='text-xs text-gray-500'>
                    {
                      FEATURE_DESCRIPTIONS[feature as keyof FeatureAccess]
                        .description
                    }
                  </p>
                </div>
                {hasAccess ? (
                  <ShieldCheckF
                    height={28}
                    width={28}
                    className='text-green-500'
                  />
                ) : (
                  <ShieldCloseF
                    height={28}
                    width={28}
                    className='text-red-500'
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberAccessControl;

function ShieldCheckF(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='1em'
      height='1em'
      {...props}
    >
      <path
        fill='currentColor'
        d='M.649 3.322L8 .565l7.351 2.757a1 1 0 0 1 .649.936v4.307c0 3.177-1.372 6.2-3.763 8.292L8 20.565l-4.237-3.708A11.02 11.02 0 0 1 0 8.565V4.258a1 1 0 0 1 .649-.936m6.29 7.51L5.525 9.42a1 1 0 1 0-1.414 1.414l2.121 2.121a1 1 0 0 0 1.414 0l4.243-4.243a1 1 0 1 0-1.414-1.414l-3.536 3.536z'
      ></path>
    </svg>
  );
}

function ShieldCloseF(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='1em'
      height='1em'
      {...props}
    >
      <path
        fill='currentColor'
        d='m9.414 9.565l1.414-1.414a1 1 0 1 0-1.414-1.414L8 8.15L6.586 6.737A1 1 0 1 0 5.172 8.15l1.414 1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414L8 10.98l1.414 1.414a1 1 0 1 0 1.414-1.414zM.65 3.322L8 .565l7.351 2.757a1 1 0 0 1 .649.936v4.307c0 3.177-1.372 6.2-3.763 8.292L8 20.565l-4.237-3.708A11.02 11.02 0 0 1 0 8.565V4.258a1 1 0 0 1 .649-.936z'
      ></path>
    </svg>
  );
}

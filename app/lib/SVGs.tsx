import classNames from 'classnames';
import { FC, SVGProps } from 'react';

// TOOD: convert

export const eyeOpenIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-6 w-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
    />
  </svg>
);

export const eyeClosedIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-6 w-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
    />
  </svg>
);

export const DownChevronIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m19.5 8.25-7.5 7.5-7.5-7.5'
      />
    </svg>
  );
};

//TODO: remove when all locations are replaced with function above
export const downChevronIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-5 w-5'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='m19.5 8.25-7.5 7.5-7.5-7.5'
    />
  </svg>
);

export const DeleteIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      // className='h-6 w-6'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
      />
    </svg>
  );
};

export const IconEllipsisVertical: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox='0 0 128 512'
      fill={props.fill || 'currentColor'}
      height={props.height || '1em'}
      width={props.width || '1em'}
      {...props}
    >
      <path d='M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm56-104c0 30.9-25.1 56-56 56S8 126.9 8 96s25.1-56 56-56 56 25.1 56 56z' />
    </svg>
  );
};

export const IconPlus: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox='0 0 1024 1024'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <defs>
        <style />
      </defs>
      <path d='M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z' />
      <path d='M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z' />
    </svg>
  );
};

export const IconSearch: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox='0 0 1024 1024'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path d='M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z' />
    </svg>
  );
};

export const IconClose: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox='0 0 1024 1024'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z' />
    </svg>
  );
};

export const IconAppstoreAdd: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox='0 0 1024 1024'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <defs>
        <style />
      </defs>
      <path d='M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zm52 132H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200zM424 712H296V584c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v128H104c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h128v128c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V776h128c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z' />
    </svg>
  );
};

export const IconListAdd: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox='0 0 1000 1000'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path d='M350 450c14.667 0 26.667 5 36 15 9.333 10 14 21.667 14 35 0 13.333-5 25-15 35s-21.667 15-35 15H50c-13.333 0-25-5-35-15S0 513.333 0 500c0-13.333 4.667-25 14-35s21.333-15 36-15h300m0 200c14.667 0 26.667 5 36 15 9.333 10 14 21.667 14 35 0 13.333-5 25-15 35s-21.667 15-35 15H50c-13.333 0-25-5-35-15S0 713.333 0 700c0-13.333 4.667-25 14-35s21.333-15 36-15h300m620-200c20 0 30 16.667 30 50s-10 50-30 50H800v170c0 20-16.667 30-50 30s-50-10-50-30V550H536c-20 0-30-16.667-30-50s10-50 30-50h164V280c0-20 16.667-30 50-30s50 10 50 30v170h170M350 250c14.667 0 26.667 5 36 15 9.333 10 14 21.667 14 35 0 13.333-5 25-15 35s-21.667 15-35 15H50c-13.333 0-25-5-35-15S0 313.333 0 300c0-13.333 4.667-25 14-35s21.333-15 36-15h300' />
    </svg>
  );
};

export const Spinner: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <div role='status'>
      <svg
        aria-hidden='true'
        className={classNames(
          props.fill ? '' : 'fill-secondary',
          'inline animate-spin text-gray-200'
        )}
        viewBox='0 0 100 101'
        fill='currentColor'
        height='1em'
        width='1em'
        xmlns='http://www.w3.org/2000/svg'
        {...props}
      >
        <path
          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
          fill='currentColor'
        />
        <path
          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
          fill='currentFill'
        />
      </svg>
      <span className='sr-only'>Loading...</span>
    </div>
  );
};

export const ToolTipIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
      />
    </svg>
  );
};

export const EditIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
      />
    </svg>
  );
};

export const IconHeadAlertOutline: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path d='M13 3c3.9 0 7 3.1 7 7 0 2.8-1.6 5.2-4 6.3V21H9v-3H8c-1.1 0-2-.9-2-2v-3H4.5c-.4 0-.7-.5-.4-.8L6 9.7C6.2 5.9 9.2 3 13 3m0-2C8.4 1 4.6 4.4 4.1 8.9L2.5 11c-.6.8-.6 1.8-.2 2.6.4.7 1 1.2 1.7 1.3V16c0 1.9 1.3 3.4 3 3.9V23h11v-5.5c2.5-1.7 4-4.4 4-7.5 0-5-4-9-9-9m1 14h-2v-2h2v2m0-4h-2V5h2' />
    </svg>
  );
};

export const IconOptionsOutline: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox='0 0 512 512'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={32}
        d='M368 128h80M64 128h240M368 384h80M64 384h240M208 256h240M64 256h80'
      />
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={32}
        d='M368 128 A32 32 0 0 1 336 160 A32 32 0 0 1 304 128 A32 32 0 0 1 368 128 z'
      />
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={32}
        d='M208 256 A32 32 0 0 1 176 288 A32 32 0 0 1 144 256 A32 32 0 0 1 208 256 z'
      />
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={32}
        d='M368 384 A32 32 0 0 1 336 416 A32 32 0 0 1 304 384 A32 32 0 0 1 368 384 z'
      />
    </svg>
  );
};

export const IconBackupRestore: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path d='M12 3a9 9 0 00-9 9H0l4 4 4-4H5a7 7 0 017-7 7 7 0 017 7 7 7 0 01-7 7c-1.5 0-2.91-.5-4.06-1.3L6.5 19.14A9.115 9.115 0 0012 21a9 9 0 009-9 9 9 0 00-9-9m2 9a2 2 0 00-2-2 2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2z' />
    </svg>
  );
};

export const EmptyListIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox='0 0 576 512'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path d='M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0l-218.6-101c-8.5-4-13.9-12.5-13.9-21.8s5.4-17.9 13.9-21.8l218.6-101zm212.4 204.4l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0l-218.6-101c-8.5-4-13.9-12.5-13.9-21.8s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2a88.1 88.1 0 0073.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0l-218.6-101c-8.5-4-13.9-12.5-13.9-21.8s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2a88.1 88.1 0 0073.8 0z' />
    </svg>
  );
};

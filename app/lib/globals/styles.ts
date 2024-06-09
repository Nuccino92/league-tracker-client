/**
 * @description
 * Container classes for input components.
 *
 * @locations
 * app\profile\_components\UserProfileForms.tsx,
 * app\profile\control-panel\[slug]\page.tsx
 * app\register\page.tsx
 * app\login\page.tsx
 * app\lib\components\CreateLeagueModal.tsx
 * app\control-panel\league\[slug]\teams\_components\TeamForm.tsx
 */

export const inputContainerClasses = `flex flex-col space-y-3`;

/**
 * @description
 * Input classes.
 *
 * @locations
 * app\profile\_components\UserProfileForms.tsx,
 * app\profile\control-panel\[slug]\page.tsx
 * app\lib\components\_auth\AuthFormInput.tsx
 * app\profile\control-panel\_components\CreateNewSeasonModal.tsx
 * app\lib\components\CreateLeagueModal.tsx
 * app\control-panel\league\[slug]\teams\_components\TeamForm.tsx
 */

export const inputClasses =
  'h-10 w-full rounded-md border border-slate-200 px-2 focus:border-inherit focus:outline-offset-0 focus:outline-secondary focus:ring-0';

/**
 * @description
 * For placeholder loading skeleton tags.
 *
 * @locations
 * app\control-panel\league\[slug]\teams\_components\TeamForm.tsx,
 */

export const skeletonClass = `animate-pulse bg-zinc-200 rounded`;

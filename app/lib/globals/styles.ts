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
 * app\control-panel\league\[slug]\players\_components\PlayerForm.tsx
 * app\control-panel\league\[slug]\seasons\_components\Seasons.tsx
 * app\control-panel\league\[slug]\seasons\_components\ActivateSeasonModal.tsx
 * app\lib\components\_scheduler\EventFormModal.tsx
 * app\control-panel\league\[slug]\schedule\_components\ScheduleGenerationForm.tsx
 */

export const INPUT_CONTAINER_CLASSES = `flex flex-col space-y-3`;

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
 * app\control-panel\league\[slug]\players\_components\PlayerForm.tsx
 * app\control-panel\league\[slug]\seasons\_components\Seasons.tsx
 * app\control-panel\league\[slug]\seasons\_components\ActivateSeasonModal.tsx
 * app\lib\components\_scheduler\EventFormModal.tsx
 */

export const INPUT_CLASSES =
  'h-10 w-full rounded-md border border-slate-200 px-2 focus:border-inherit focus:outline-offset-0 focus:outline-secondary focus:ring-0';

/**
 * @description
 * For placeholder loading skeleton tags.
 *
 * @locations
 * app\control-panel\league\[slug]\teams\_components\TeamForm.tsx,
 * app\control-panel\league\[slug]\players\_components\PlayerForm.tsx
 */

export const SKELETON_CLASSES = `animate-pulse bg-zinc-200 rounded`;

/**
 * @description
 * Tailwind classes for the sidebar Link.
 *
 * @locations
 * app\control-panel\_components\Sidebar.tsx
 */
export const SIDEBAR_LINK_CLASSES = `flex items-center space-x-3 px-6 py-2 hover:bg-secondary/10`;

/**
 * @description
 * Tailwind classes for menu dropdown items
 *
 * @locations
 * app\control-panel\league\[slug]\teams\_components\Teams.tsx
 * app\control-panel\league\[slug]\players\_components\Players.tsx
 * app\control-panel\league\[slug]\members\_components\MembersList.tsx
 * app\control-panel\league\[slug]\teams\[id]\_components\TeamRoster.tsx
 */

export const MENU_ITEM_CLASSES = `hover:bg-secondary hover:text-white w-full p-2 text-start`;

/**
 * @description
 * Tailwind classes for event cards
 *
 * @locations
 * app\lib\components\_scheduler\TimeGridEvent.tsx
 */

export const SPORT_EVENT_BACKGROUND_COLOR = 'bg-red-300';
export const PRACTICE_EVENT_BACKGROUND_COLOR = 'bg-blue-300';
export const CUSTOM_EVENT_BACKGROUND_COLOR = 'bg-green-300';

/**
 * @description
 * Used to style certain selectables
 *
 * @locations
 * app\lib\types\Resources\GenerateGameShedule.ts
 * app\lib\components\_scheduler\CustomRecurrenceForm.tsx
 *
 */

export const GRAY_BOX_CLASSES =
  'h-10 w-max rounded border !bg-gray-100 px-3 py-2 text-sm font-medium !shadow-none transition-colors duration-75 hover:!bg-gray-200';

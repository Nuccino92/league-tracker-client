'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

import { IconSettingsOutline, Spinner } from '@/app/lib/SVGs';
import {
  useNotificationSettings,
  useNotificationSettingsToggle,
} from '@/app/lib/hooks/api/notifications';
import StyledBox from '@/app/lib/components/StyledBox';
import Checkbox from '@/app/lib/components/Checkbox';
import { NotificationType } from '@/app/lib/types/notification.types';

export default function NotificationSettings() {
  const { response, status } = useNotificationSettings();

  const toggleNotificationSettingMut = useNotificationSettingsToggle();

  function handleToggle(type: NotificationType, isChecked: boolean) {
    toggleNotificationSettingMut.mutateAsync({ type, isChecked });
  }

  return (
    <Menu as='div' className='relative'>
      {({ open }) => (
        <>
          <Menu.Button className='flex items-center gap-2'>
            <span>
              <IconSettingsOutline height={20} width={20} />
            </span>
            <span>Settings</span>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 z-10 mt-4'>
              <StyledBox classes='p-6 sm:w-[435px] w-[350px]'>
                <div className='mb-6'>
                  <div className='text-xl font-bold'>Notification Settings</div>
                </div>

                {status === 'loading' ? (
                  <div className='flex items-center justify-center'>
                    <Spinner height={25} width={25} />
                  </div>
                ) : (
                  <div className='space-y-1'>
                    <div className='grid grid-cols-[1fr_50px_50px] items-center'>
                      <div aria-hidden />
                      <div className='text-center'>App</div>
                      <div className='text-center'>Email</div>
                      {/* <div>SMS</div> */}
                    </div>

                    {status === 'success' &&
                      response?.notification_types.map((setting) => (
                        <div
                          key={setting.type}
                          className='grid grid-cols-[1fr_50px_50px] items-center py-2'
                        >
                          <div>
                            <div className='font-medium'>{setting.name}</div>
                            <div className='max-w-[250px] text-xs text-gray-600'>
                              {setting.description}
                            </div>
                          </div>

                          <div className='flex items-center justify-center'>
                            <Checkbox
                              isChecked={setting.in_app_enabled}
                              onClick={() =>
                                handleToggle(
                                  setting.type,
                                  !setting.in_app_enabled
                                )
                              }
                            />
                          </div>

                          <div className='flex items-center justify-center'>
                            <Checkbox
                              isChecked={setting.email_enabled}
                              onClick={() =>
                                handleToggle(
                                  setting.type,
                                  !setting.email_enabled
                                )
                              }
                            />
                          </div>

                          {/* <Checkbox
                            isChecked={setting.sms_enabled}
                            onClick={() =>
                              handleToggle(setting.type, !setting.sms_enabled)
                            }
                          /> */}
                        </div>
                      ))}
                  </div>
                )}
              </StyledBox>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}

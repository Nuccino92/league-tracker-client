'use client';

import { useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { z } from 'zod';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import Modal from '@/app/lib/components/Modal';
import {
  useAddTeamMember,
  useMember,
  useModifyTeamMember,
  useValidateUserEmailForMembers,
} from '@/app/lib/hooks/api/control-panel/members';
import { ModalType } from '@/app/types';
import FormLabel from '@/app/control-panel/_components/FormLabel';
import { cn } from '@/app/lib/utils';
import { INPUT_CLASSES } from '@/app/lib/globals/styles';
import {
  CloseCircleSolid,
  CheckmarkCircle,
  Spinner,
  InformationCircle,
} from '@/app/lib/SVGs';
import ListBox from '@/app/lib/components/Listbox';
import getEnumKeyByEnumValue from '@/app/lib/utils/getEnumKeyByEnumValue';
import { MemberRolesEnum } from '@/app/lib/enums';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';
import MemberAccessControl from '@/app/control-panel/league/[slug]/members/_components/MemberAccessControl';
import { Button } from '@/app/lib/components/Button';
import {
  AddMemberSaveValues,
  ModifyMemberSaveValues,
} from '@/app/lib/types/Resources/CreateMemberResource';

export default function MemberForm({
  isOpen,
  close,
  memberId,
}: ModalType & { memberId?: number }) {
  const { slug, leagueData } = useLeagueControlPanel();

  const { member, status } = useMember({
    slug: slug,
    memberId,
  });

  const [isEmailValid, setIsEmailValid] = useState(memberId ? true : false);

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const addMemberMut = useAddTeamMember();
  const modifyMemberMut = useModifyTeamMember();

  const validateEmailMut = useValidateUserEmailForMembers();

  return (
    <Modal panelClasses='sm:w-[640px] w-full' isOpen={isOpen} close={close}>
      <div>
        <div className='text-lg font-bold'>
          {memberId ? 'Modify Member' : 'Add Member'}
        </div>
        {status === 'success' && member ? (
          <Formik
            onSubmit={async (formValues) => {
              if (memberId) {
                const values: ModifyMemberSaveValues = {
                  member_id: memberId,
                  role: formValues.role,
                };

                await modifyMemberMut.mutateAsync(values);
              } else {
                const emailResult = z
                  .string()
                  .email()
                  .safeParse(formValues.email);

                if (emailResult.success) {
                  const values: AddMemberSaveValues = {
                    email: formValues.email,
                    role: formValues.role,
                  };

                  await addMemberMut.mutateAsync(values);
                }
              }

              close();
            }}
            initialValues={member}
          >
            {(props) => (
              <Form>
                {/* Email Section */}
                <div className='mt-4 flex flex-col space-y-1 text-sm'>
                  <FormLabel
                    classes='text-sm font-medium'
                    label='Email'
                    htmlFor='email'
                  />

                  <div
                    className={cn(
                      'swatches-picker flex h-[150px] resize-none items-center !px-0',
                      INPUT_CLASSES
                    )}
                  >
                    <input
                      disabled={memberId ? true : false}
                      onChange={async (e) => {
                        if (memberId) return;

                        const { value } = e.target;

                        if (value === '') {
                          setIsEmailValid(false);
                        }

                        props.setFieldValue('email', value);

                        if (timeoutId) {
                          clearTimeout(timeoutId);
                        }

                        const newTimeoutId = setTimeout(async () => {
                          if (value) {
                            const emailResult = z
                              .string()
                              .email()
                              .safeParse(value);

                            if (emailResult.success) {
                              const res =
                                await validateEmailMut.mutateAsync(value);
                              setIsEmailValid(res.is_valid_email);
                            }

                            if (emailResult.error) {
                              setIsEmailValid(false);
                            }
                          }
                        }, 750);

                        setTimeoutId(newTimeoutId);
                      }}
                      value={props.values.email}
                      placeholder='Connect this member to an email...'
                      className='h-full w-full pl-2 pr-4 outline-none'
                    />
                    {props.values.email ? (
                      <div className='pr-2'>
                        {validateEmailMut.isLoading ? (
                          <Spinner height={22} width={22} />
                        ) : (
                          <>
                            {isEmailValid && (
                              <CheckmarkCircle
                                height={24}
                                width={24}
                                className='text-green-500'
                              />
                            )}
                            {!isEmailValid && (
                              <CloseCircleSolid
                                height={24}
                                width={24}
                                className='text-red-500'
                              />
                            )}
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <ErrorMessage
                    name='email'
                    component='div'
                    className='text-sm text-red-500'
                  />
                </div>

                {/* Member Permissions */}
                {isEmailValid ? (
                  <div className='mt-4 text-sm'>
                    <div className='flex flex-col space-y-1 text-sm'>
                      <FormLabel
                        classes='text-sm font-medium'
                        label='Select Role'
                        htmlFor='role'
                      />

                      <ListBox
                        buttonClasses='border'
                        value={props.values.role}
                        onChange={(value) => props.setFieldValue('role', value)}
                        buttonText={
                          props.values.role
                            ? (getEnumKeyByEnumValue(
                                MemberRolesEnum,
                                props.values.role
                              ) as string)
                            : 'Select'
                        }
                        options={[
                          ...transformIntoOptions(
                            Object.entries(MemberRolesEnum)
                              .filter(
                                ([_, value]) =>
                                  value !== 'owner' &&
                                  (value !== 'super-admin' ||
                                    leagueData.role.role_name === 'owner')
                              )
                              .map(([key, value]) => ({
                                label: key,
                                value: value,
                              })),
                            {
                              labelKey: 'label',
                              valueKey: 'value',
                            }
                          ),
                        ]}
                      />
                    </div>

                    <MemberAccessControl role={props.values.role} />

                    {!memberId || member.role !== props.values.role ? (
                      <div className='mt-8 flex w-full items-center justify-end'>
                        <Button
                          disabled={
                            addMemberMut.isLoading || modifyMemberMut.isLoading
                          }
                        >
                          {addMemberMut.isLoading ||
                          modifyMemberMut.isLoading ? (
                            <Spinner height={16} width={16} />
                          ) : memberId ? (
                            'Modify Member'
                          ) : (
                            'Generate Member Invitation'
                          )}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className='mt-4 flex h-[220px] w-full flex-col items-center justify-center gap-4 border-t pt-2 text-sm'>
                    <InformationCircle
                      className='text-blue-400'
                      height={50}
                      width={50}
                      strokeWidth={1.5}
                    />
                    <div className='px-6 text-center text-base font-medium text-gray-600'>
                      Enter the email address of an existing keepr user before
                      managing their role.
                    </div>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        ) : null}
      </div>
      {status === 'loading' ? <FormSkeleton /> : null}
    </Modal>
  );
}

function FormSkeleton() {
  return (
    <div>
      <div className='mt-4 flex flex-col space-y-1 text-sm'>
        <FormLabel
          classes='text-sm font-medium'
          label='Email'
          htmlFor='email'
        />

        <div
          className={cn(
            'swatches-picker flex h-[150px] animate-pulse resize-none items-center bg-slate-200 !px-0',
            INPUT_CLASSES
          )}
        />

        <div className='!mt-4'>
          <div className='flex flex-col space-y-1 text-sm'>
            <FormLabel
              classes='text-sm font-medium'
              label='Select Role'
              htmlFor='role'
            />{' '}
            <div
              className={cn(
                'swatches-picker flex h-[150px] animate-pulse resize-none items-center bg-slate-200 !px-0',
                INPUT_CLASSES
              )}
            />
          </div>
          <div className='mb-2 mt-4 border-b pb-2'>
            <FormLabel
              classes='text-sm font-bold'
              label='Control Panel Access'
              htmlFor=''
            />
          </div>{' '}
          <div className='flex h-[250px] items-center justify-center'>
            <Spinner height={40} width={40} />
          </div>
        </div>
      </div>
    </div>
  );
}

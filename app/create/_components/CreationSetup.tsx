'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { z } from 'zod';
import Image from 'next/image';

import {
  DeleteIcon,
  IconCaretLeft,
  IconCaretRight,
  IconCheckmarkCircleOutline,
} from '@/app/lib/SVGs';
import { DefaultColors } from '@/app/lib/enums';
import { INPUT_CLASSES } from '@/app/lib/globals/styles';
import FileUpload from '@/app/lib/components/FileUpload';
import ColorPicker from '@/app/lib/components/ColorPicker';
import { Button } from '@/app/lib/components/Button';

type Step = {
  id: number;
  label: string;
  field: string;
  navLabels: string;
  isCompleted: boolean;
  required: boolean;
};

export default function CreationSetup() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      label: 'What is your league name?',
      navLabels: 'Name',
      field: 'name',
      isCompleted: false,
      required: true,
    },
    {
      id: 2,
      label: 'Give a description of your league',
      navLabels: 'Description',
      field: 'description',
      isCompleted: false,
      required: false,
    },
    {
      id: 3,
      label: 'League Logo',
      navLabels: 'Logo',
      field: 'logo',
      isCompleted: false,
      required: false,
    },
    {
      id: 4,
      label: 'Select your league colors',
      navLabels: 'Colors',
      field: 'colors',
      isCompleted: false,
      required: false,
    },
    {
      id: 5,
      label: 'Sport Selection',
      navLabels: 'Sport',
      field: 'sport',
      isCompleted: false,
      required: true,
    },
    {
      id: 6,
      label: 'Stats Selection',
      navLabels: 'Stats',
      field: 'stats',
      isCompleted: false,
      required: true,
    },
  ]);

  // make sport selected & stat select as 1 step? or if clicking on stat selecting indicate that they have to select a sport

  const markStepAsVisited = (stepId: number) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId ? { ...step, isCompleted: true } : step
      )
    );
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  interface FormValues {
    name: string;
    logo: string;
    description: string;
    primary_color: string;
    secondary_color: string;
  }

  const initialValues: FormValues = {
    name: '',
    logo: '',
    description: '',
    primary_color: DefaultColors.Primary,
    secondary_color: DefaultColors.Secondary,
  };

  const currentQuestion = steps[currentStep - 1];

  return (
    <div className='flex h-full bg-slate-50'>
      <ProgressBar
        currentStep={currentStep - 1}
        totalSteps={steps.length - 1}
      />

      {/* Main Content */}
      <div className='flex flex-1 items-center justify-center pl-6 lg:p-6'>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            console.log('Form submitted:', values);
          }}
          validate={(values) => {
            const errors: Partial<FormValues> = {};
            const currentField = currentQuestion.field as keyof FormValues;
            const error = validateField(currentField, values[currentField]);
            if (error) {
              errors[currentField] = error;
            }
            return errors;
          }}
        >
          {({
            errors,
            setFieldError,
            touched,
            validateForm,
            setTouched,
            values,
            setFieldValue,
          }) => (
            <Form className='flex w-full flex-col justify-between space-y-6 rounded-xl bg-white p-6 shadow lg:w-[700px]'>
              <QuestionLabel
                text={currentQuestion.label}
                required={currentQuestion.required}
              />

              <div className='space-y-4'>
                {currentStep === 1 && (
                  <div>
                    <Field
                      name={currentQuestion.field}
                      className={classNames('bg-slate-50', INPUT_CLASSES)}
                      placeholder='Enter your league name...'
                      autoFocus
                    />
                  </div>
                )}
                {currentStep === 2 && (
                  <div>
                    <Field
                      name={currentQuestion.field}
                      className={classNames(
                        'swatches-picker h-[225px] resize-none bg-slate-50 py-2',
                        INPUT_CLASSES
                      )}
                      as='textarea'
                      placeholder='Enter your league description...'
                      autoFocus
                    />
                  </div>
                )}
                {currentStep === 3 && (
                  <div>
                    <div className='flex'>
                      {values.logo ? (
                        <div className='relative h-[200px] w-full  rounded-md border border-slate-200 bg-white'>
                          <Image
                            src={values.logo}
                            alt='Your league icon'
                            style={{ objectFit: 'contain' }}
                            fill
                          />

                          <button
                            onClick={async () => {
                              /*
                               * TODO:
                               * await delete from s3
                               */

                              setFieldValue('logo', null);
                            }}
                            className='absolute right-0 m-2 transition-colors hover:text-red-500'
                            type='button'
                          >
                            <DeleteIcon width={24} height={24} />
                          </button>
                        </div>
                      ) : (
                        <FileUpload
                          name='logo'
                          view='control-panel'
                          maxFileSize={500 * 1024}
                          classnames='!bg-slate-50'
                          changeEvent={(value) => {
                            if (errors['logo']) {
                              setFieldError('logo', '');
                            }
                            setFieldValue('logo', value);
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className='space-y-6'>
                    <div className=''>
                      <div className='mb-2 text-sm font-medium'>
                        Primary color
                      </div>
                      <div className='flex items-center space-x-3'>
                        <ColorPicker
                          color={values.primary_color ?? '#00337C'}
                          buttonClasses='w-[100px]'
                          saveColor={(color: string) =>
                            setFieldValue('primary_color', color)
                          }
                        />
                        {values.primary_color !== '#00337C' ? (
                          <button
                            type='button'
                            className='text-s, h-10 rounded bg-red-500 px-2 text-sm font-medium text-white ring-secondary transition-all duration-100 hover:ring-1'
                            onClick={() =>
                              setFieldValue('primary_color', '#00337C')
                            }
                          >
                            Reset to Default
                          </button>
                        ) : null}
                      </div>

                      {errors['primary_color'] ? (
                        <div className='text-sm text-red-500'>
                          {errors['primary_color']}
                        </div>
                      ) : null}
                    </div>
                    <div className=''>
                      <div className='mb-2 text-sm font-medium'>
                        Secondary color
                      </div>

                      <div className='flex items-center space-x-3'>
                        <ColorPicker
                          color={values.secondary_color ?? '#03C988'}
                          buttonClasses='w-[100px]'
                          saveColor={(color: string) =>
                            setFieldValue('secondary_color', color)
                          }
                        />
                        {values.secondary_color !== '#03C988' ? (
                          <button
                            type='button'
                            className='text-s, h-10 rounded bg-red-500 px-2 text-sm font-medium text-white ring-secondary transition-all duration-100 hover:ring-1'
                            onClick={() =>
                              setFieldValue('secondary_color', '#03C988')
                            }
                          >
                            Reset to Default
                          </button>
                        ) : null}
                      </div>

                      {errors['secondary_color'] ? (
                        <div className='text-sm text-red-500'>
                          {errors['secondary_color']}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {errors[currentQuestion.field as keyof FormValues] &&
                  touched[currentQuestion.field as keyof FormValues] && (
                    <div className='text-sm text-red-500'>
                      {errors[currentQuestion.field as keyof FormValues]}
                    </div>
                  )}
              </div>

              <div className='flex justify-between space-x-4'>
                <button
                  disabled={currentStep === 1}
                  type='button'
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                  }}
                  className='rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-25'
                >
                  Previous
                </button>

                {currentStep < steps.length ? (
                  <Button
                    className='rounded-md text-sm'
                    onClick={async (e) => {
                      e.preventDefault();
                      // Mark the current field as touched to trigger validation
                      await setTouched({
                        [currentQuestion.field]: true,
                      });
                      // Validate the form
                      const errors = await validateForm();
                      // Check if there are any errors for the current field
                      const hasErrors =
                        errors[currentQuestion.field as keyof FormValues];
                      if (!hasErrors) {
                        setCurrentStep(currentStep + 1);
                        markStepAsVisited(currentQuestion.id);
                      }

                      if (hasErrors) {
                        setSteps(
                          steps.map((step) =>
                            step.id === currentQuestion.id
                              ? { ...step, isCompleted: false }
                              : step
                          )
                        );
                      }
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <button
                    type='submit'
                    className='rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50'
                  >
                    Submit
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Side Navigation */}
      <div className='relative m-3 flex items-center justify-center sm:m-6 sm:h-[calc(100vh-130px)] sm:min-w-14'>
        <SideNavigation
          isNavCollapsed={isNavCollapsed}
          setIsNavCollapsed={setIsNavCollapsed}
          steps={steps}
          handleStepClick={handleStepClick}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
}

type SideNavigationProps = {
  isNavCollapsed: boolean;
  setIsNavCollapsed: Dispatch<SetStateAction<boolean>>;
  steps: Step[];
  handleStepClick: (id: number) => void;
  currentStep: number;
};

function SideNavigation({
  isNavCollapsed,
  setIsNavCollapsed,
  steps,
  handleStepClick,
  currentStep,
}: SideNavigationProps) {
  return (
    <>
      <div
        className={classNames(
          isNavCollapsed
            ? 'sm:h-[calc(100vh-130px)] sm:w-14'
            : 'h-[calc(100vh-130px)] w-64',
          'absolute right-0 top-0 z-10 rounded-xl border bg-white text-sm shadow transition-all duration-200 ease-in-out sm:top-auto xl:relative'
        )}
      >
        <div className='flex items-center justify-between border-b p-4'>
          <span
            className={classNames(
              isNavCollapsed ? 'sm:hidden' : '',
              'font-medium'
            )}
          >
            Progress
          </span>
          <button
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            className='rounded p-1 hover:bg-gray-100'
          >
            {isNavCollapsed ? (
              <IconCaretLeft height={18} width={18} />
            ) : (
              <IconCaretRight height={18} width={18} />
            )}
          </button>
        </div>

        <div
          className={classNames(isNavCollapsed ? 'hidden' : '', 'p-2 sm:block')}
        >
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={classNames(
                'mb-1 w-full rounded p-2 !text-left disabled:opacity-50',
                step.id === currentStep
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-gray-50',
                isNavCollapsed &&
                  '!flex h-10 w-10 min-w-[40px] !items-center !justify-center !text-center'
              )}
            >
              <div
                className={classNames(
                  isNavCollapsed && 'justify-center',
                  'flex items-center text-center'
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center rounded',
                    step.isCompleted && !isNavCollapsed
                      ? 'bg-secondary text-white'
                      : step.id === currentStep && !isNavCollapsed
                        ? 'bg-primary text-white'
                        : 'bg-gray-200',
                    isNavCollapsed ? '!bg-transparent' : 'mr-2 h-6 w-6'
                  )}
                >
                  {step.isCompleted ? (
                    <IconCheckmarkCircleOutline
                      width={20}
                      height={20}
                      color={isNavCollapsed ? 'rgb(3 201 13)' : 'white'}
                    />
                  ) : (
                    step.id
                  )}
                </div>
                {!isNavCollapsed && (
                  <span className='truncate'>{step.navLabels}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>{' '}
      <div
        onClick={() => setIsNavCollapsed(true)}
        className={classNames(
          !isNavCollapsed
            ? 'fixed bottom-0 left-0 h-[calc(100vh-80px)] w-screen bg-black/10'
            : '',
          'xl:!hidden'
        )}
      />
    </>
  );
}

const ProgressBar = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className='fixed left-0 top-0  mt-[80px] w-full bg-slate-50'>
      <div className='h-1'>
        <div
          className='h-full bg-secondary transition-all duration-300 ease-in-out'
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

function QuestionLabel({
  text,
  required = false,
}: {
  text: string;
  required?: boolean;
}) {
  return (
    <div className='space-x-1 text-2xl font-bold'>
      <span>{text}</span>
      {required && <span className='text-red-500'>*</span>}
    </div>
  );
}

const validateField = (fieldName: string, value: any): string | undefined => {
  switch (fieldName) {
    case 'name':
      if (!value) return 'The league name is required';
      if (value.length < 5) return 'League name must be at least 5 characters';
      if (value.length > 50) return 'Length must not exceed 50 characters';
      break;
    case 'logo':
      if (value) {
        try {
          new URL(value);
          if (value.length < 5) return 'URL must be at least 5 characters';
          if (value.length > 255) return 'URL must not exceed 255 characters';
        } catch {
          return 'The logo must be a URL';
        }
      }
      break;
    case 'description':
      if (value) {
        if (value.length > 300)
          return 'Description must not exceed 300 characters';
        if (value.length > 0 && value.length < 20)
          return 'Description must be at least 20 characters if provided';
      }
      break;
    case 'primary_color':
      if (!value) return 'Required';
      if (!/^#[0-9A-Fa-f]{6}$/.test(value)) return 'Must be a hex color code';
      break;
    case 'secondary_color':
      if (!value) return 'Required';
      if (!/^#[0-9A-Fa-f]{6}$/.test(value)) return 'Must be a hex color code';
      break;
  }
};

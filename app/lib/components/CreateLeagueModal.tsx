'use client';

import {
  ChangeEvent,
  Dispatch,
  JSX,
  SVGProps,
  SetStateAction,
  useState,
} from 'react';
import classNames from 'classnames';
import { z } from 'zod';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import {
  useAuth,
  useCreateLeague,
  useIsFreeTrialAvailable,
} from '@/app/GlobalContext';
import Modal from './Modal';
import { SportType } from '../types/sport.types';
import { inputClasses, inputContainerClasses } from '../constants/styles';
import FileUpload from '@/app/lib/components/FileUpload';
import { deleteIcon } from '../SVGs';
import ColorPicker from '@/app/lib/components/ColorPicker';
import {
  LeagueInformationResource,
  leagueInformationSchema,
} from '../types/Resources/CreateLeagueResource';
import { organizationInformationSchema } from '../types/Resources/CreateOrganizationResource';
import { useCreateLeague as useCreateLeagueHook } from '../hooks/api/league';
// import { checkIfSlugIsUnique } from '../requests/slugs';

const CheckoutForm = dynamic(() => import('./CheckoutForm'), {
  loading: () => <></>,
});

/**
 *
 * create steps
 * 1. choose between (league - organization)
 * 2. choose sport (baseball, baseball, hockey etc.)
 * 3. maybe select features (league site, payments, etc.)
 * 4. league form (name, logo, url, description. etc) -TODO: could re use form inside /profile
 *
 */

/**
 * @types
 */

type Type = 'league' | 'organization' | null;
type LeagueFeatures = { website: boolean };
type Errors = {
  name: string;
  logo: string;
  slug: string;
  description: string;
  primary_color: string;
  secondary_color: string;
};
type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function CreateLeagueModal() {
  const { user } = useAuth();
  const { showCreateLeaugueModal, setShowCreateLeagueModal } =
    useCreateLeague();

  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<Type>(null);

  const [stripeProductID, setStripeProductID] = useState<string | null>(null);
  const [stripePaymentID, setStripePaymentID] = useState<string | null>(null);

  const createLeagueMutation = useCreateLeagueHook();

  // const [features, setFeatures] = useState<LeagueFeatures>({
  //   website: false,
  // });

  const [leagueInformation, setLeagueInformation] =
    useState<LeagueInformationResource>(defaultLeagueInformation);

  const [organizationInformation, setOrganiztionInformation] = useState<any>(
    defaultOrganizationInformation
  );

  const [errors, setErrors] = useState<Errors>(defaultErrors);
  const isFreeTrialAvailable = useIsFreeTrialAvailable();

  /**
   * @description resets the form if user goes back and changes type
   */
  function handleTypeSelect(newType: Type) {
    if (newType === 'league') {
      setOrganiztionInformation(defaultOrganizationInformation);
      setErrors(defaultErrors);

      setStripeProductID(
        process.env.NEXT_PUBLIC_STRIPE_LEAGUE_PRODUCT_ID as string
      );
    }
    if (newType === 'organization') {
      setLeagueInformation(defaultLeagueInformation);
      //  setSport(null);
      //  setFeatures(defaultLeagueFeatures);
      setErrors(defaultErrors);

      setStripeProductID(
        process.env.NEXT_PUBLIC_STRIPE_ORGANIZATION_PRODUCT_ID as string
      );
    }

    setStripePaymentID(null);
  }

  async function handleSubmitLeaguePayment(payment_method: string) {
    if (!user) return;
    if (!stripePaymentID || !stripeProductID) return;

    await createLeagueMutation.mutateAsync({
      formData: leagueInformation as LeagueInformationResource,
      subscription: {
        payment_method_id: payment_method,
        product_id: stripeProductID,
        price_id: stripePaymentID,
      },
    });
  }

  return (
    <Modal
      panelClasses='sm:w-[750px] w-full'
      isOpen={showCreateLeaugueModal}
      close={() => setShowCreateLeagueModal(false)}
    >
      <div className=''>
        <div className='mb-6 flex items-center justify-between font-bold'>
          {step !== 1 ? (
            <div className='text-3xl capitalize text-black'>{type}</div>
          ) : null}{' '}
          <h2 className='mr-8 text-3xl text-secondary'>keepr</h2>
        </div>

        <div>
          {step === 1 ? (
            <TypeOptions
              step={step}
              setStep={setStep}
              type={type}
              setType={setType}
              handleTypeSelect={handleTypeSelect}
            />
          ) : null}

          {type === 'league' ? (
            <>
              {/* {step === 2 ? (
                <SportOptions
                  step={step}
                  setStep={setStep}
                  sport={sport}
                  setSport={setSport}
                />
              ) : null} */}

              {step === 2 ? (
                <CreationForm
                  // features={features}
                  header='Enter League Information'
                  step={step}
                  setStep={setStep}
                  leagueOrOrganization={'league'}
                  formData={leagueInformation}
                  setFormData={(name: string, value: string | null) => {
                    setLeagueInformation((prev) => {
                      return {
                        ...prev,
                        [name]: value,
                      };
                    });
                  }}
                  errors={errors}
                  setErrors={setErrors}
                />
              ) : null}

              {step === 3 ? (
                // <FeatureOptions
                //   step={step}
                //   setStep={setStep}
                //   features={features}
                //   setFeatures={setFeatures}
                // />

                <>
                  {isFreeTrialAvailable ? (
                    <SubscriptionNavigation
                      step={step}
                      setStep={setStep}
                      type={type}
                      formData={leagueInformation}
                    />
                  ) : (
                    <DurationSelection
                      step={step}
                      setStep={setStep}
                      setStripePaymentID={setStripePaymentID}
                      stripePaymentID={stripePaymentID}
                    />
                  )}
                </>
              ) : null}

              {step === 4 ? (
                <div>
                  <div className='py-10'>
                    <CheckoutForm
                      submitRequest={handleSubmitLeaguePayment}
                      isProcessingPayment={createLeagueMutation.isLoading}
                    />
                  </div>

                  <div className='mt-6 flex w-full items-center justify-between  text-sm font-medium text-gray-600 transition-colors duration-100'>
                    <button
                      className='flex items-center space-x-2 hover:text-secondary'
                      onClick={() => setStep((prev) => (prev - 1) as Step)}
                    >
                      <span>
                        {
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='h-4 w-4'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3'
                            />
                          </svg>
                        }
                      </span>{' '}
                    </button>

                    {isFreeTrialAvailable ? (
                      <button type='button' className='hover:text-secondary'>
                        Continue with 14 day free trial
                      </button>
                    ) : (
                      <span></span>
                    )}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {/* {type === 'organization' ? (
            <>
              {step === 2 ? (
                <CreationForm
                  features={features}
                  header='Enter Organization Information'
                  step={step}
                  setStep={setStep}
                  leagueOrOrganization={'organization'}
                  formData={organizationInformation}
                  setFormData={(name: string, value: string) => {
                    setOrganiztionInformation((prev) => {
                      return {
                        ...prev,
                        [name]: value,
                      };
                    });
                  }}
                  errors={errors}
                  setErrors={setErrors}
                />
              ) : null}
            </>
          ) : null} */}
        </div>
      </div>
    </Modal>
  );
}

type StepTypes = {
  step: Step;
  setStep: Dispatch<SetStateAction<Step>>;
};

function TypeOptions({
  step,
  setStep,
  type,
  setType,
  handleTypeSelect,
}: StepTypes & {
  type: Type;
  setType: Dispatch<SetStateAction<Type>>;
  handleTypeSelect(newType: Type): void;
}) {
  const isFreeTrialAvailable = useIsFreeTrialAvailable();

  return (
    <div className='space-y-8'>
      <div className='flex w-full space-x-2'>
        <div
          role='button'
          onClick={() => {
            const newType: Type = 'league';

            if (type === newType) return;

            setType(newType);
            handleTypeSelect(newType);
          }}
          className={classNames(
            type === 'league' ? 'border-secondary' : '',
            'relative flex w-full cursor-pointer flex-col items-center space-y-4 rounded border-2 px-2 py-6'
          )}
        >
          <h3
            className={classNames(
              type === 'league' ? 'text-secondary' : '',
              'text-xl font-bold'
            )}
          >
            League
          </h3>
          <IconCube
            height={75}
            width={75}
            color={type === 'league' ? 'rgb(3 201 136)' : 'black'}
          />

          {isFreeTrialAvailable ? (
            <div
              className={classNames(
                //  type === 'league' ? 'text-secondary' : '',
                'h-4 text-sm font-medium text-gray-600'
              )}
            >
              Free 14 day trial
            </div>
          ) : null}

          <p className='!mt-8 px-1 text-center text-sm font-medium'>
            Simplify your sports league management. With our platform, you can
            efficiently create and organize teams, coordinate game schedules,
            securely handle payments, and more—all within a user-friendly
            interface designed for seamless operation.
          </p>

          <RadioButton isChecked={type === 'league'} />
        </div>

        <div
          role='button'
          onClick={() => {
            const newType: Type = 'organization';

            if (type === newType) return;

            setType(newType);
            handleTypeSelect(newType);
          }}
          className={classNames(
            type === 'organization' ? 'border-secondary' : '',
            'relative flex w-full cursor-pointer flex-col items-center space-y-4 rounded border-2 px-2 py-6'
          )}
        >
          <h3
            className={classNames(
              type === 'organization' ? 'text-secondary' : '',
              'text-xl font-bold'
            )}
          >
            Organization
          </h3>

          <IconCubes
            height={75}
            width={75}
            color={type === 'organization' ? 'rgb(3 201 136)' : 'black'}
          />

          {isFreeTrialAvailable ? <div className='h-4' /> : null}

          <p className='!mt-8 px-1 text-center text-sm font-medium'>
            Easily manage multiple leagues under one umbrella. Create and
            organize various leagues, divisions, and teams effortlessly.
            Coordinate schedules, track payments, and oversee all aspects of
            your sports community from one centralized platform.
          </p>

          <RadioButton isChecked={type === 'organization'} />
        </div>
      </div>

      <ModalNavigation
        step={step}
        setStep={setStep}
        canProgress={type ? true : false}
      />
    </div>
  );
}

function CreationForm({
  step,
  setStep,
  formData,
  setFormData,
  leagueOrOrganization,
  header,
  errors,
  setErrors,
  // features,
}: StepTypes & {
  formData: LeagueInformationResource;
  leagueOrOrganization: Type;
  setFormData: (name: string, value: string | null) => void;
  header: string;
  errors: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
  //features: LeagueFeatures;
}) {
  const { token } = useAuth();

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData(name, value);
    if (errors[name as keyof Errors]) {
      setErrors((prev) => {
        return {
          ...prev,
          [name]: '',
        };
      });
    }
  }

  async function handleSubmit(
    formData: LeagueInformationResource
  ): Promise<'success' | 'validation-error'> {
    try {
      if (leagueOrOrganization === 'league') {
        const p = leagueInformationSchema.parse({
          ...formData,
          description:
            formData.description === '' ? null : formData.description,
          //  slug: formData.slug === '' ? null : formData.slug,
        });

        // if (formData.slug) {
        //   const response = await checkIfSlugIsUnique({
        //     token,
        //     slug: formData.slug,
        //     context: 'league',
        //   });

        //   if (!response.unique) {
        //     setErrors((prev) => {
        //       return {
        //         ...prev,
        //         slug: 'The URL path is already taken',
        //       };
        //     });
        //     return 'validation-error';
        //   }
        // }

        // const league = safeParse(formData) -> returns a value instead of throwing error

        return 'success';
      }
      // if (leagueOrOrganization === 'organization') {
      //   organizationInformationSchema.parse(formData);
      // }
      return 'success';
    } catch (error) {
      if (error) {
        console.log(error);
        Object.entries(error).map(([key, value]) => {
          if (key === 'issues') {
            return value.map((val: any) =>
              setErrors((prev) => {
                return {
                  ...prev,
                  [val.path[0]]: val.message,
                };
              })
            );
          }
        });
      }

      return 'validation-error';
    }
  }

  return (
    <div>
      <h2 className='mb-4 text-xl font-bold italic'>{header}</h2>

      <div className='input-container space-y-5'>
        <div className={inputContainerClasses}>
          <InputLabel
            htmlFor={`${leagueOrOrganization}-name`}
            label='Name'
            required
          />
          <input
            id={`${leagueOrOrganization}-name`}
            name='name'
            className={inputClasses}
            value={formData.name}
            onChange={handleChange}
            placeholder='Enter your league name'
          />

          {errors['name'] ? <ErrorDisplay text={errors['name']} /> : null}
        </div>
        <div className={inputContainerClasses}>
          <InputLabel htmlFor={`${leagueOrOrganization}-logo`} label='Logo' />

          {formData.logo ? (
            <div className='relative h-[200px] w-full  rounded-md border border-slate-200 bg-white'>
              <Image
                src={formData.logo}
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

                  setFormData('logo', null);
                }}
                className='absolute right-0 m-2 transition-colors hover:text-red-500'
                type='button'
              >
                {deleteIcon}
              </button>
            </div>
          ) : (
            <FileUpload
              name='logo'
              view='control-panel'
              maxFileSize={500 * 1024}
              changeEvent={(value) => {
                if (errors['logo']) {
                  setErrors((prev) => {
                    return {
                      ...prev,
                      ['logo']: '',
                    };
                  });
                }
                setFormData('logo', value);
              }}
              // errorEvent={(message)=> }
            />
          )}

          {errors['logo'] ? <ErrorDisplay text={errors['logo']} /> : null}
        </div>

        {/* {leagueOrOrganization === 'league' ? (
          <div className={inputContainerClasses}>
            <InputLabel
              htmlFor={`${leagueOrOrganization}-slug`}
              label='Name used inside url'
            />
            <input
              name='slug'
              className={inputClasses}
              type='text'
              value={formData.slug ?? ''}
              onChange={handleChange}
              id={`${leagueOrOrganization}-slug`}
              placeholder='Enter your league slug'
            />
            {errors['slug'] ? <ErrorDisplay text={errors['slug']} /> : null}
          </div>
        ) : null} */}

        <div className={inputContainerClasses}>
          <InputLabel
            htmlFor={`${leagueOrOrganization}-description`}
            label='Description'
          />
          <textarea
            value={formData.description ? formData.description : ''}
            className={classNames(inputClasses, 'min-h-[200px] !py-2')}
            name='description'
            id={`${leagueOrOrganization}-description`}
            placeholder='Enter your league description'
            onChange={handleChange}
          />

          {errors['description'] ? (
            <ErrorDisplay text={errors['description']} />
          ) : null}
        </div>

        {leagueOrOrganization === 'league' ? (
          <>
            <div className={inputContainerClasses}>
              <InputLabel
                htmlFor={`${leagueOrOrganization}-primary-color`}
                label='League Primary Color'
              />
              <div className='flex items-center space-x-3'>
                <ColorPicker
                  color={formData.primary_color ?? '#00337C'}
                  buttonClasses='w-[100px]'
                  saveColor={(color: string) =>
                    setFormData('primary_color', color)
                  }
                />
                {formData.primary_color !== '#00337C' ? (
                  <button
                    type='button'
                    className='text-s, h-10 rounded bg-red-500 px-2 text-sm font-medium text-white ring-secondary transition-all duration-100 hover:ring-1'
                    onClick={() => setFormData('primary_color', '#00337C')}
                  >
                    Reset to Default
                  </button>
                ) : null}
              </div>

              {errors['primary_color'] ? (
                <ErrorDisplay text={errors['primary_color']} />
              ) : null}
            </div>
            <div className={inputContainerClasses}>
              <InputLabel
                htmlFor={`${leagueOrOrganization}-secondary-color`}
                label='League Secondary Color'
              />

              <div className='flex items-center space-x-3'>
                <ColorPicker
                  color={formData.secondary_color ?? '#03C988'}
                  buttonClasses='w-[100px]'
                  saveColor={(color: string) =>
                    setFormData('secondary_color', color)
                  }
                />
                {formData.secondary_color !== '#03C988' ? (
                  <button
                    type='button'
                    className='text-s, h-10 rounded bg-red-500 px-2 text-sm font-medium text-white ring-secondary transition-all duration-100 hover:ring-1'
                    onClick={() => setFormData('primary_color', '#03C988')}
                  >
                    Reset to Default
                  </button>
                ) : null}
              </div>

              {errors['secondary_color'] ? (
                <ErrorDisplay text={errors['secondary_color']} />
              ) : null}
            </div>
          </>
        ) : null}
      </div>

      <ModalNavigation
        step={step}
        setStep={setStep}
        canProgress
        submitForm={() => handleSubmit(formData)}
      />
    </div>
  );
}

function DurationSelection({
  step,
  setStep,
  setStripePaymentID,
  stripePaymentID,
}: {
  step: Step;
  setStep: Dispatch<SetStateAction<Step>>;
  setStripePaymentID: Dispatch<SetStateAction<string | null>>;
  stripePaymentID: string | null;
}) {
  const monthyID = process.env
    .NEXT_PUBLIC_STRIPE_LEAGUE_MONTHLY_PRICE_ID as string;
  const yearlyID = process.env
    .NEXT_PUBLIC_STRIPE_LEAGUE_YEARLY_PRICE_ID as string;

  const isMonthlySelected = stripePaymentID === monthyID;
  const isYearlySelected = stripePaymentID === yearlyID;

  return (
    <div className=''>
      <h2 className='mb-4 text-xl font-bold italic'>
        Select Subscription Type
      </h2>
      <div className='mb-10 flex items-center space-x-6'>
        <div
          role='button'
          className={classNames(
            isMonthlySelected ? ' border-secondary text-secondary' : '',
            'relative flex h-[220px] w-full  flex-col justify-between space-y-2 rounded border-2 p-4 text-center'
          )}
          onClick={() => setStripePaymentID(monthyID)}
        >
          <div className='font-bold'>Standard Pricing</div>
          <div className='font-medium'>
            <div>
              <span className='text-4xl'>$34.99</span>/<span>month</span>
            </div>
            <div className='flex h-10 items-center justify-center' />
          </div>

          <button
            className={classNames(
              isMonthlySelected ? 'bg-secondary' : 'bg-black',
              'w-full py-2 text-sm font-medium text-white'
            )}
          >
            Select Monthly
          </button>
        </div>
        <div
          role='button'
          className={classNames(
            isYearlySelected ? ' border-secondary text-secondary' : '',
            'relative flex h-[220px] w-full  flex-col justify-between space-y-2 rounded border-2 p-4 text-center'
          )}
          onClick={() => setStripePaymentID(yearlyID)}
        >
          <span className='font-bold'>Yearly Pricing</span>
          <div className='font-medium'>
            <div>
              <span className='text-4xl'>$299.99</span>/<span>year</span>
            </div>

            <div className='flex h-10 items-center justify-center text-xs'>
              Save $10 per month
            </div>
          </div>

          <button
            className={classNames(
              isYearlySelected ? 'bg-secondary' : 'bg-black',
              'w-full py-2 text-sm font-medium text-white'
            )}
          >
            Select Yearly
          </button>
        </div>
      </div>
      <ModalNavigation
        step={step}
        setStep={setStep}
        canProgress={stripePaymentID ? true : false}
      />
    </div>
  );
}

function SubscriptionNavigation({
  step,
  setStep,
  type,
  formData,
}: {
  step: Step;
  setStep: Dispatch<SetStateAction<Step>>;
  type: Type;
  formData: LeagueInformationResource;
}) {
  const { user } = useAuth();

  const createLeagueMutation = useCreateLeagueHook();

  async function handleTrialClick() {
    if (type === 'league') {
      await createLeagueMutation.mutateAsync({
        formData: {
          ...formData,
          owner_id: user.id,
        } as LeagueInformationResource & {
          owner_id: string;
          sport: SportType;
        },
      });
    }
    if (type === 'organization') {
    }
  }

  return (
    <div>
      <h2 className='mb-4 text-xl font-bold'>{'header'}</h2>
      <div className='flex items-center space-x-4'>
        <button
          onClick={handleTrialClick}
          type='button'
          className='h-20 w-full rounded border font-medium transition-colors duration-100 ease-in hover:bg-secondary hover:text-white'
        >
          Active 14 day trial
        </button>
        <button
          onClick={() => setStep((prev) => (prev + 1) as Step)}
          type='button'
          className='h-20 w-full rounded border font-medium transition-colors duration-100 ease-in hover:bg-secondary hover:text-white'
        >
          Continue to Payment
        </button>
      </div>

      <div className='mt-6 text-sm font-medium'>{step} of 4</div>
    </div>
  );
}

function ModalNavigation({
  step,
  setStep,
  canProgress,
  submitForm,
}: StepTypes & {
  canProgress: boolean;
  submitForm?: () => any;
}) {
  /**
   *@TODO Possibly add steps
   */

  return (
    <div className='flex w-full items-center justify-between space-x-4 text-sm font-medium'>
      {' '}
      {step !== 1 ? <div>{step} of 4</div> : <div />}
      <div className='space-x-4'>
        {' '}
        <button
          type='button'
          disabled={step === 1}
          onClick={() => {
            if (step === 1) return;
            setStep((step - 1) as Step);
          }}
          className={classNames(
            step === 1 ? 'hidden' : '',
            'rounded border p-2'
          )}
        >
          Previous
        </button>
        <button
          type='button'
          onClick={async () => {
            if (!canProgress) return;
            if (submitForm) {
              const result = await submitForm();
              if (result === 'validation-error') return;
            }
            setStep((step + 1) as Step);
          }}
          className={classNames(
            canProgress
              ? 'border-secondary bg-secondary text-white'
              : 'text-gray-200',
            'rounded border p-2'
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function RadioButton({
  isChecked,
  buttonClass,
  spanClass,
  onClick,
}: {
  isChecked: boolean;
  buttonClass?: string;
  spanClass?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      className={classNames(
        buttonClass,
        isChecked ? 'ring-secondary' : 'ring-gray-200',
        'absolute right-0 top-0 !m-2 flex h-[18px] w-[18px] items-center justify-center rounded-full p-0.5 ring-2'
      )}
    >
      <span
        className={classNames(
          spanClass,
          isChecked ? 'border-secondary bg-secondary ring-secondary' : '',
          'flex h-full w-full rounded-full'
        )}
      />
    </button>
  );
}

function InputLabel({
  htmlFor,
  label,
  required = false,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className='font-bold text-zinc-600'>
      <span>{label}</span>{' '}
      {required ? <span className='text-red-500'>*</span> : null}
    </label>
  );
}

function ErrorDisplay({ text }: { text: string }) {
  return <div className='text-sm font-medium text-red-500'>{text}</div>;
}

const defaultLeagueInformation: LeagueInformationResource = {
  name: '',
  logo: null,
  // slug: '',
  description: null,
  primary_color: '#00337C',
  secondary_color: '#03C988',
};

const defaultOrganizationInformation: any = {
  name: '',
  logo: '',
  description: '',
};

const defaultLeagueFeatures: LeagueFeatures = {
  website: false,
};

const defaultErrors = {
  name: '',
  logo: '',
  slug: '',
  description: '',
  primary_color: '',
  secondary_color: '',
};

type X = z.infer<typeof organizationInformationSchema>;

function IconCube(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 512 512'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path d='M234.5 5.7c13.9-5 29.1-5 43.1 0l192 68.6c25.4 9.1 42.4 33.2 42.4 60.3v242.8c0 27-17 51.2-42.5 60.3l-192 68.6c-13.9 5-29.1 5-43.1 0l-192-68.6C17 428.6 0 404.5 0 377.4V134.6c0-27 17-51.2 42.5-60.3l192-68.6zM256 66L82.3 128 256 190l173.7-62L256 66zm32 368.6l160-57.1v-188l-160 57.1v188z' />
    </svg>
  );
}

function IconCubes(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 576 512'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path d='M290.8 48.6l78.4 29.7-81.2 31.2-81.2-31.2 78.4-29.7c1.8-.7 3.8-.7 5.7 0zM136 92.5v112.2c-1.3.4-2.6.8-3.9 1.3l-96 36.4C14.4 250.6 0 271.5 0 294.7v119.2c0 22.2 13.1 42.3 33.5 51.3l96 42.2c14.4 6.3 30.7 6.3 45.1 0L288 457.5l113.5 49.9c14.4 6.3 30.7 6.3 45.1 0l96-42.2c20.3-8.9 33.5-29.1 33.5-51.3V294.7c0-23.3-14.4-44.1-36.1-52.4l-96-36.4c-1.3-.5-2.6-.9-3.9-1.3V92.5c0-23.3-14.4-44.1-36.1-52.4L308 3.7c-12.8-4.8-26.9-4.8-39.7 0l-96 36.4C150.4 48.4 136 69.3 136 92.5zm256 118.1l-82.4 31.2v-89.2L392 121v89.6zm-237.2 40.3l78.4 29.7-81.2 31.1-81.2-31.1 78.4-29.7c1.8-.7 3.8-.7 5.7 0zm18.8 204.4V354.8l82.4-31.6v95.9l-82.4 36.2zm247.6-204.4c1.8-.7 3.8-.7 5.7 0l78.4 29.7-81.3 31.1-81.2-31.1 78.4-29.7zm102 170.3l-77.6 34.1V354.8l82.4-31.6v90.7c0 3.2-1.9 6-4.8 7.3z' />
    </svg>
  );
}

function FeatureOptions({
  step,
  setStep,
  features,
  setFeatures,
}: StepTypes & {
  features: {
    website: boolean;
  };
  setFeatures: Dispatch<
    SetStateAction<{
      website: boolean;
    }>
  >;
}) {
  return (
    <div className='space-y-8'>
      <h2 className='text-xl font-bold'>Select Features </h2>
      {/* Website Feature */}
      <div className='relative flex items-center space-x-2 text-sm font-medium'>
        <RadioButton
          isChecked={features.website ? true : false}
          buttonClass='!rounded-none h-[14px] w-[14px] !relative'
          spanClass='!rounded-none'
          onClick={() =>
            setFeatures((prev) => {
              return {
                ...prev,
                website: !prev.website,
              };
            })
          }
        />{' '}
        <span>Include website?</span>
      </div>

      <ModalNavigation step={step} setStep={setStep} canProgress />
    </div>
  );
}

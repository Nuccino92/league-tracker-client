import { z } from 'zod';

export const registrationFormSchema = z.object({
  // Required fields
  firstName: z
    .string({
      required_error: 'First name is required',
    })
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string({
      required_error: 'Last name is required',
    })
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z
    .string({
      required_error: 'Phone number is required',
    })
    .min(10, 'Phone number is too short')
    .max(15, 'Phone number is too long')
    .regex(/^\d+$/, 'Phone number can only contain digits'),
  photo: z.string().max(500, 'Photo link is too long').optional(),

  // Optional emergency contact
  emergencyContactName: z
    .string()
    .max(100, 'Emergency contact name is too long')
    .optional(),
  emergencyContactPhone: z
    .string()
    .max(15, 'Emergency contact phone is too long')
    .regex(/^\d+$/, 'Phone number can only contain digits')
    .optional()
    .nullable(),

  // Required waiver
  waiverAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must accept the waiver to register'),
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

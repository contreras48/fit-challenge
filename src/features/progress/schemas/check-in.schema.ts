import { z } from 'zod'

export const checkInSchema = z.object({
  weight: z
    .string()
    .min(1, 'El peso es obligatorio')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Ingresa un peso válido mayor a 0',
    }),
  chest_cm: z.string().optional(),
  waist_cm: z.string().optional(),
  hip_cm: z.string().optional(),
  notes: z.string().optional(),
})

export type CheckInInput = z.infer<typeof checkInSchema>
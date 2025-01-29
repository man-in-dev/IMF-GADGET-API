import z from 'zod';
import { GadgetStatus } from '@prisma/client';

export const idParamSchema = z.object({
    id: z.string()
});

export const querySchema = z.object({
    status: z.enum([
        GadgetStatus.AVAILABLE,
        GadgetStatus.DEPLOYED,
        GadgetStatus.DECOMMISSIONED,
        GadgetStatus.DESTROYED
    ])
});

export const updateBodySchema = z.object({
    name: z.string().optional(),
    status: z.enum([
        GadgetStatus.AVAILABLE,
        GadgetStatus.DEPLOYED,
        GadgetStatus.DECOMMISSIONED,
        GadgetStatus.DESTROYED
    ]).optional()
});

export const registrationSchema = z.object({
    name: z.string().min(1, { message: 'Name should not be empty' }),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string()
});

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string()
});
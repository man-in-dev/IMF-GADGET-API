import { Request, Response } from 'express';
import { GadgetStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { generateCodename } from '../utils/codename';
import { idParamSchema, querySchema, updateBodySchema } from '../utils/inputValidation';
import getPrismaClient from '../utils/prismaClient';

const prisma = getPrismaClient();

// GET all gadgets
export const getAllGadgets = async (req: Request, res: Response) => {

  try {
    const gadgets = await prisma.gadget.findMany({});

    const gadgetsWithProbability = gadgets.map((gadget) => ({
      ...gadget,
      missionSuccessProbability: `${Math.floor(Math.random() * (100 - 50 + 1)) + 50}%`,
    }));

    res.status(200).json({ 
      success: true, 
      message: 'Gadgets fetched successfully.',
      data: gadgetsWithProbability 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// POST add a new gadget
export const addGadget = async (req: Request, res: Response) => {
  try {
    // Generate a random codename
    const name = generateCodename();

    // Check if gadget exists with same codename
    const gadget = await prisma.gadget.findUnique({
        where: { name }
    });

    if(gadget) {
        res.status(200).json({ success: false, message: "name already exist" });
        return;
    }

    const newGadget = await prisma.gadget.create({
      data: { name }
    });
    res.status(201).json({ 
      success: true, 
      message: 'Gadget added successfully.',
      data: newGadget
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// PATCH update a gadget
export const updateGadget = async (req: Request, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  const parsedBody = updateBodySchema.safeParse(req.body);

  if(parsedParams.error) {
    res.status(400).json({ success: false, message: parsedParams.error.message });
    return;
  }

  if(parsedBody.error) {
    res.status(400).json({ success: false, message: parsedBody.error.message });
    return;
  }

  const { id } = parsedParams.data;
  const { name, status } = parsedBody.data;

  try {
    const gadget = await prisma.gadget.findUnique({
        where: { id }
    });

    if(!gadget) {
        res.status(404).json({ success: false, message: "Gadget not found" });
        return;
    }

    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: { 
        name: name || gadget.name, 
        status: status || gadget.status 
      },
    });

    res.status(200).json({ 
      success: true,       
      message: 'Gadget updated successfully.',
      data: updatedGadget 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// DELETE mark gadget as decommissioned
export const decommissionGadget = async (req: Request, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);

  if(parsedParams.error) {
    res.status(400).json({ success: false, message: parsedParams.error.message });
    return;
  }

  const { id } = parsedParams.data;

  try {
    const gadget = await prisma.gadget.findUnique({
        where: { id }
    });

    if(!gadget) {
        res.status(404).json({ success: false, message: "Gadget not found" });
        return;
    }

    const decommissionedGadget = await prisma.gadget.update({
      where: { id },
      data: { status: GadgetStatus.DECOMMISSIONED, decommissionedAt: new Date() },
    });

    res.status(200).json({ success: true, data: decommissionedGadget });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const selfDestructGadget = async (req: Request, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);

  if(parsedParams.error) {
    res.status(400).json({ success: false, message: parsedParams.error.message });
    return;
  }

  const { id } = parsedParams.data;

  try {
    const gadget = await prisma.gadget.findUnique({
      where: { id },
    });

    if (!gadget) {
      res.status(404).json({ success: false, message: 'Gadget not found' });
      return
    }

    const confirmationCode = uuidv4();

    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: GadgetStatus.DESTROYED,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Self-destruct sequence activated.',
      confirmationCode,
      data: updatedGadget,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// GET gadgets by status
export const getAllGadgetsByStatus = async (req: Request, res: Response) => {
  const { data, error } = querySchema.safeParse(req.query);

  if(error) {
    res.status(400).json({ success: false, message: error.message });
    return;
  }

  const { status } = data;

  try {
    const gadgets = await prisma.gadget.findMany({
      where: {
        status
      }
    });

    const gadgetsWithProbability = gadgets.map((gadget) => ({
      ...gadget,
      missionSuccessProbability: `${Math.floor(Math.random() * (100 - 50 + 1)) + 50}%`,
    }));

    res.status(200).json({ success: true, data: gadgetsWithProbability });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


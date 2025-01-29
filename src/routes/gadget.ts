import { Router } from 'express';

import { addGadget, decommissionGadget, getAllGadgets, getAllGadgetsByStatus, selfDestructGadget, updateGadget } from '../controllers/gadget';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllGadgets);
router.get('/filter', authenticate, getAllGadgetsByStatus);
router.post('/', authenticate, addGadget);
router.post('/:id/self-destruct', authenticate, selfDestructGadget);
router.patch('/:id', authenticate, updateGadget);
router.delete('/:id', authenticate, decommissionGadget);


export default router;

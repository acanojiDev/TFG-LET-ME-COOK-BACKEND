import { Router } from 'express';
import { PlaceController } from './places.controller';

const router = Router();

/**
  TODO SWAGGER
 */
router.get('/', PlaceController.getPlaces);

/**
 * TODO SWAGGER
 */
router.get('/:id', PlaceController.getPlaceById);

/**
 * TODO SWAGGER
 */
router.post('/', PlaceController.createPlace);

/**
 * TODO SWAGGER
 */
router.put('/:id', PlaceController.updatePlace);

/**
 * TODO SWAGGER
 */
router.delete('/:id', PlaceController.deletePlace);

export default router;

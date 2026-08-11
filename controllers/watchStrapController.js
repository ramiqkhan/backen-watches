import watchStrapService from '../services/watchStrapService.js';

export const createStrap = async (req, res) => {
  try {
    const strap = await watchStrapService.createStrap(req.body);
    res.status(201).json({ success: true, data: strap });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllStraps = async (req, res) => {
  try {
    const straps = await watchStrapService.getAllStraps();
    res.status(200).json({ success: true, count: straps.length, data: straps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStrapsByType = async (req, res) => {
  try {
    const { strapType } = req.params;
    const decodedType = decodeURIComponent(strapType);
    const straps = await watchStrapService.getStripsByType(decodedType);
    res.status(200).json({ success: true, count: straps.length, data: straps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStrap = async (req, res) => {
  try {
    const strap = await watchStrapService.updateStrap(req.params.id, req.body);
    res.status(200).json({ success: true, data: strap });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStrap = async (req, res) => {
  try {
    const result = await watchStrapService.deleteStrap(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
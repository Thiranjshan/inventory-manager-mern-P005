import Item from "../models/item.model.js";

export const createItem = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    const item = await Item.create({
      name,
      price,
      quantity
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find();

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.status(200).json({
      message: "Item deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
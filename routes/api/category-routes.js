const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
// be sure to include its associated Products
router.get('/', async (req, res) => {
  await Category.findAll({
    attributes: [ 'category_name' ],
    include: [
      {model: Product, attributes: ['id', 'product_name', 'price', 'stock']}
    ]
  })
  .then(categories => {
    res.json(categories);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  });
});

// find one category by its `id` value
// be sure to include its associated Products
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findOne({
      where: { id: categoryId },
      attributes: ['id', 'category_name'],
      include: {model: Product, attributes: ['id', 'product_name', 'price', 'category_id']}
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found"});
    }
    res.json(category);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});



// create a new category
router.post('/', async (req, res) => {
  const { category_name } = req.body

  await Category.create({
    category_name: category_name,
  })
  .then((category) => {
    res.status(200).json(category);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  const categoryId = req.params.id;

  await Category.update(req.body, {
    where: {
      id: categoryId,
    },
  })
  .then((results) => {
    if (results[0] === 0) {
      return res.status(404).json({error: 'Category not found!'});
    }
    res.json({ message: "Category updated successfully" });
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.delete('/:id', async (req, res) => {
  try{
    const deleteId = req.params.id
    // delete one product by its `id` value
   const deleteCategory = await Category.destroy({
      where: { id: deleteId },
    });
    if (!deleteCategory) {
      return res.status(404).json({ error: "Product not found"})
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
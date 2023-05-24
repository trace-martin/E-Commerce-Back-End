const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
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

router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

  // find one category by its `id` value
  // be sure to include its associated Products
    const category = await Category.findByPk(categoryId, {
      attributes: ['id', 'category_name'],
      include: [{model: Product, include: ['id', 'product_name', 'price', 'stock']}]
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found"});
    }
    res.json(category);
  } catch(error) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create a new category
router.post('/', (req, res) => {
  const { category_name } = req.body

  Category.create({
    category_name: category_name,
  })
  .then((category) => {
    res.status(200).json(category);
  })
  .catch((error) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  const categoryId = req.params.id;
  Category.update(req.body, {
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

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
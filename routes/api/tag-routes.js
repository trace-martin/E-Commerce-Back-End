const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags
// be sure to include its associated Product data
router.get('/', async (req, res) => {
  await Tag.findAll({
    attributes: [ 'tag_name' ],
    include: [
      {model: Product, attributes: ['id', 'product_name', 'price', 'stock', 'category_id']}
    ]
  })
  .then(tags => {
    res.json(tags);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  });
});

// find a single tag by its `id`
// be sure to include its associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;

    const tags = await Tag.findOne({
      where: { id: tagId},
      attributes: ['id', 'tag_name'],
      include: {model: Product, attributes: ['id', 'product_name', 'price', 'stock', 'category_id']}
    });
    if (!tags) {
      return res.status(404).json({ error: "Tag not found"});
    }
    res.json(tags)
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create a new tag
router.post('/', async (req, res) => {
  const { tag_name } = req.body
  
  await Tag.create({
    tag_name: tag_name,
  })
  .then((tag) => {
    res.status(200).json(tag);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  const tagId = req.params.id;

  await Tag.update(req.body, {
    where: {
      id: tagId,
    }
  })
  .then((results) => {
    if (results[0] === 0) {
      return res.status(404).json({error: 'Tag not found!'});
    }
    res.json({ message: "Tag updated successfully" });
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try{
    const deleteId = req.params.id
    // delete one product by its `id` value
   const deleteTag = await Tag.destroy({
      where: { id: deleteId },
    });
    if (!deleteTag) {
      return res.status(404).json({ error: "Product not found"})
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

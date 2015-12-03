import { Router } from 'express';
const router = new Router();

router.post('/drafts/', (req, res) => {
  console.log(req.body);
  res.json({
    message: 'created!!',
  });
});

router.get('/drafts/', (req, res) => {
  console.log(req.headers);
  res.json({
    message: 'fetched!!',
  });
});

export default router;

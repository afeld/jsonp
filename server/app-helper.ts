import corsFn from 'cors';

export const cors = corsFn({
  maxAge: 60 * 60 * 24, // one day
  methods: ['GET']
});

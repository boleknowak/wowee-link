import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
  url: string;
  data: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const response = await fetch(`${process.env.API_URL}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const text = await response.text();
  const data = JSON.parse(text);

  res.status(200).json({ name: 'John Doe', url: process.env.API_URL || '', data });
}

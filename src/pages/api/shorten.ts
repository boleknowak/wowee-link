import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const url = req.body.url;
    const response = await fetch(`${process.env.API_URL}/shorten`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      return res.status(500).json({
        data: {
          error: 'Something went wrong with the API',
        },
      });
    }

    const text = await response.text();
    if (!text) {
      return res.status(500).json({
        data: {
          error: 'Something went wrong with the API',
        },
      });
    }

    const data = JSON.parse(text);

    return res.status(200).json({ data });
  } catch (error: any) {
    return res.status(500).json({
      data: {
        error: error.message,
      },
    });
  }
}

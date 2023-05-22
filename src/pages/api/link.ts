import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const code = req.query.code;
    const response = await fetch(`${process.env.API_URL}/get-link/${code}`);

    if (!response.ok) {
      return res.status(response.status).json({
        data: {
          error: 'Something went wrong with the API: ' + response.statusText,
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

import type { NextApiRequest, NextApiResponse } from 'next';
import { UserCreate, User } from '@/app/interfaces';
import { signup } from '@/api/firebase/auth';

type ResponseData = {
  user: User | null;
  message: string;
};

function isValidUser(user: UserCreate): boolean {
    return !!(user.email && user.password && user.firstName && user.lastName);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    if (req.method === 'POST') {
      try {
        const user: UserCreate = req.body;
  
        if (!isValidUser(user)) {
          res.status(400).json({    
            user: null,
            message: 'Please fill out all fields',
          });
        }
  
        let resUser = null;
        try {
          const signupUser = await signup(user);
          const uid = signupUser.uid;
          const email = signupUser.providerData[0].email;
          const { firstName, lastName, is_admin } = signupUser;
          resUser = { uid, email, firstName, lastName, is_admin };
  
          res.status(201).json({
            user: resUser,
            message: 'Success: User created',
          });
        } catch (error: any) {
          console.error('Error during signup', error);
          res.status(400).json({
            user: null,
            message: error.message,
          });
        }
  
      } catch (error) {
        res.status(400).json({
          user: null,
          message: 'Please fill out all fields',
        });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
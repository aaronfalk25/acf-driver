import type { NextApiRequest, NextApiResponse } from 'next';
import { UserSignin, User } from '@/app/interfaces';
import { signin } from '@/api/firebase/auth';

type ResponseData = {
  user: User | null;
  message: string;
};

function isValidUser(user: UserSignin): boolean {
    return !!(user.email && user.password);
} 

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    if (req.method === 'POST') {
      try {
        const user: UserSignin = req.body;
  
        if (!isValidUser(user)) {
          res.status(400).json({    
            user: null,
            message: 'Please fill out all fields',
          });
        }
  
        let resUser: User | null = null;
        try {
          const signinUser = await signin(user);
          const uid = signinUser.uid;
          const email = signinUser.providerData[0].email;
          const { firstName, lastName, is_admin } = signinUser;
          resUser = { uid, email, firstName, lastName, is_admin };
  
          res.status(200).json({
            user: resUser,
            message: 'User signed in successfully',
          });
        } catch (error: any) {
          console.error('Error during signin', error);
          res.status(400).json({
            user: null,
            message: error.message,
          });
        }
      } catch (error: any) {
        res.status(500).json({
            user: null,
            message: 'Unknown error occurred during signin',
          });
      }
    } else {
      res.status(405).json({
        user: null,
        message: 'Method not allowed',
      });
    }
  }
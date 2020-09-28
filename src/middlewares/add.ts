import { RequestHandler } from 'express'
import { FieldValue } from '@google-cloud/firestore'
import firestoreClient from '../config/firestore'
import { Repositories } from '../types/user'

const addMiddleware: RequestHandler<any, any, Repositories, any> = async (
  req,
  res
) => {
  try {
    const uid = req.session!.userID

    const docData = await firestoreClient.collection('Users').doc(uid).get()

    if (!docData.exists) res.status(400).json(null)
    else {
      const reqBody = req.body

      await firestoreClient
        .collection('Users')
        .doc(uid)
        .update({
          repositories: FieldValue.arrayUnion(reqBody)
        })

      res.status(200).json({ data: reqBody })
    }
  } catch {
    res.status(500).json(null)
  }
}

export default addMiddleware

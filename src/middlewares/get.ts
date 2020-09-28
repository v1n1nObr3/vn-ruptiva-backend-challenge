import { RequestHandler } from 'express'
import firestoreClient from '../config/firestore'
import { Repositories } from '../types/user'

const getMiddleware: RequestHandler = async (req, res) => {
  try {
    const uid = req.session!.userID

    const docData = await firestoreClient.collection('Users').doc(uid).get()

    if (!docData.exists) res.status(400).json(null)
    else {
      const userRepositories = docData.get('repositories') as Repositories[]
      res.status(200).json({ data: userRepositories })
    }
  } catch {
    res.status(500).json(null)
  }
}

export default getMiddleware

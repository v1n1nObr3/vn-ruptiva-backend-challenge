import { RequestHandler } from 'express'
import { compareSync } from 'bcryptjs'
import firestoreClient from '../config/firestore'

const loginMiddleware: RequestHandler = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  // --------------------------- Checking if req.body is valid. --------------------------
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json(null)
    return
  }

  if (email.length < 8) {
    res.status(400).json(null)
    return
  }
  // ------------------------------------------------------------------------------------

  try {
    // --------------------- Checking if user exists in database. --------------------
    const query = await firestoreClient
      .collection('Users')
      .where('record.email', '==', email)
      .get()

    if (query.empty) {
      res.status(400).json(null)
      return
    }
    // --------------------------------------------------------------------------------

    // ----------------------- Checking if password is correct. -----------------------
    const passwordStored = query.docs[0].get('record.password') as string

    const isValidPassword = compareSync(password, passwordStored)

    if (!isValidPassword) {
      res.status(400).json(null)
      return
    }
    // --------------------------------------------------------------------------------

    // --------------------------- Creating cookie session. ---------------------------
    const uid = query.docs[0].get('record.uid') as string
    req.session!.userID = uid
    // --------------------------------------------------------------------------------

    res.status(200).json({ message: 'Successfully logged.' })
    return
  } catch {
    res.status(500).json(null)
    return
  }
}

export default loginMiddleware

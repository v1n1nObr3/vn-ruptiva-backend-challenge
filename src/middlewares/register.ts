import { RequestHandler } from 'express'
import firestoreClient from '../config/firestore'
import { v4 } from 'uuid'
import { genSaltSync, hashSync } from 'bcryptjs'
import User from '../types/user'

const registerMiddleware: RequestHandler = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  // ------------------------ Checking if req.body is valid. ------------------------
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json(null)
    return
  }

  if (email.length < 8) {
    res.status(400).json(null)
    return
  }
  // --------------------------------------------------------------------------------

  try {
    // --------------- Checking if user already exists in database. ---------------
    const query = await firestoreClient
      .collection('Users')
      .where('record.email', '==', email)
      .get()

    if (!query.empty) {
      res.status(200).json({ message: 'E-mail already registered.' })
      return
    }
    // ----------------------------------------------------------------------------

    // ------------------- Making a unique ID for the new user. -------------------
    const uid = v4()
    // ----------------------------------------------------------------------------

    // ----------- Making a hashed and salted password for the new user. ----------
    const hashedPassword = hashSync(password, genSaltSync(14))
    // ----------------------------------------------------------------------------

    // --------------- Creating a new user and storing on database. ---------------
    const newUser: User = {
      record: {
        email,
        password: hashedPassword,
        uid
      },
      repositories: []
    }

    await firestoreClient.collection('Users').doc(uid).set(newUser)

    res.status(201).json({ message: 'User successfully created.' })
    return
    // ----------------------------------------------------------------------------
  } catch (error) {
    console.log(error)
    res.status(500).json(null)
    return
  }
}

export default registerMiddleware

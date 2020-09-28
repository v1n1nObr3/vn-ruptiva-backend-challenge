import { Firestore } from '@google-cloud/firestore'

const firestoreClient = new Firestore({
  projectId: 'ruptiva-project-012588',
  keyFilename: './keyfile.json'
})

export default firestoreClient

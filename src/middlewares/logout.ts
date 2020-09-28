import { RequestHandler } from 'express'

const logoutMiddleware: RequestHandler = async (req, res) => {
  try {
    // --------------------------- Destroying user session. --------------------------
    await new Promise<void>((resolve, reject) => {
      req.session!.destroy((err) => (err ? reject(err) : resolve()))
    })
    // -------------------------------------------------------------------------------

    res.setHeader(
      'Set-Cookie',
      'ruptiva=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    )
    res.status(200).json(null)
  } catch {
    res.setHeader(
      'Set-Cookie',
      'ruptiva=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    )
    res.status(500).json(null)
  }
}

export default logoutMiddleware

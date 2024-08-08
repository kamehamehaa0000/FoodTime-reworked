import mongoose from 'mongoose'
import '../config/env'
import { Admin } from '../models/admin.model'
const uri: string | undefined = process.env.MONGO_URI
export default async function ConnectToDatabase(): Promise<void> {
  try {
    if (uri) {
      await mongoose.connect(uri).catch((err) => {
        throw new Error((err as Error).message)
      })
      const adminCount = await Admin.countDocuments()
      if (adminCount === 0) {
        const defaultAdmin = new Admin({
          username: 'admin',
          password: 'mypass123',
        })
        await defaultAdmin.save()
        console.log('Default admin created')
      }

      console.log(
        mongoose.connection.readyState
          ? 'Successfully Connected To Database !!'
          : 'NOT CONNECTED TO DATABASE'
      )
    }
  } catch (error) {
    console.log((error as Error).message)
  }
}

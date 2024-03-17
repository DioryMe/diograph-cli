// TODO: Fix to '@diograph/diograph/types' (works in S3Client, at least ConnectionClient)
import { ConnectionClientList } from '@diograph/diograph/types.js'
import { LocalClient } from '@diograph/local-client'
import { getS3Credentials } from './configManager.js'
import { S3Client } from '@diograph/s3-client'

export const getAvailableClients = async (): Promise<ConnectionClientList> => {
  const availableClients: ConnectionClientList = {
    LocalClient: {
      clientConstructor: LocalClient,
    },
  }

  // S3Client is not available if no credentials found from config file
  try {
    const credentials = await getS3Credentials()
    availableClients['S3Client'] = {
      clientConstructor: S3Client,
      credentials: { region: 'eu-west-1', credentials },
    }
  } catch (err) {
    if ((err as Error).message !== 'No s3Credentials defined in config file') {
      throw err
    }
  }

  return availableClients
}

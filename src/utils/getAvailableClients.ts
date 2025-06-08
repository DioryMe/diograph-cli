// TODO: Fix to '@diograph/diograph/types' (works in S3Client, at least ConnectionClient)
import { ConnectionClientList } from '@diograph/diograph/types'
import { LocalClient } from '@diograph/local-client'
import { getHttpCredentials, getS3Credentials } from './configManager.js'
import { S3Client } from '@diograph/s3-client'
import { HttpClient } from '@diograph/http-client'

export const getAvailableClients = async (): Promise<ConnectionClientList> => {
  const availableClients: ConnectionClientList = {
    LocalClient: {
      clientConstructor: LocalClient,
    },
  }

  let credentials
  try {
    credentials = await getHttpCredentials()
  } catch (err) {
    console.log('No httpCredentials defined in config file')
  }
  availableClients['HttpClient'] = {
    clientConstructor: HttpClient,
    credentials,
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

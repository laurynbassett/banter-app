import * as FileSystem from 'expo-file-system'
import {CLOUD_FUNCTION_URL} from 'react-native-dotenv'
import {functions} from '../Firebase'
// import * as Speech from '@google-cloud/speech'

async function getTranscription(file) {
  try {
    // google cloud function
    const audioToText = functions.httpsCallable('audio-to-text')

    // format uri in storage location format
    file.uri = `gs://fsa-capstone-red-team.appspot.com/audio/${file.name}`
    // transcription
    const {data} = await audioToText(file)
    return data
  } catch (err) {
    console.error('Error transcribing audio: ', err)
  }
}

export default getTranscription

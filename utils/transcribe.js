import * as FileSystem from 'expo-file-system'
import {CLOUD_FUNCTION_URL} from 'react-native-dotenv'
import {functions} from '../Firebase'
// import * as Speech from '@google-cloud/speech'

async function getTranscription(file) {
  try {
    // google cloud function
    const info = await FileSystem.getInfoAsync(file.uri)
    console.log(`FILE INFO: ${JSON.stringify(info)}`)
    const uri = info.uri

    const formData = new FormData()
    formData.append('file', {
      uri,
      type: 'audio/x-wav',
      name: file.name,
    })
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      // headers: new Headers({
      //   'Content-Type': 'multipart/form-data',
      // }),
      body: formData,
    })
    console.log('RESPONSE', response)
    const data = await response.json()
    console.log('TRANSCRIPTION DATA', data)

    // firebase call function
    // // source:
    // const audioToText = functions.httpsCallable('audio-to-text')
    // const response = await audioToText(file)
    // console.log('RESPONSE', response)

    // cloud speech to text api
    /*
    // const speech = new Speech.SpeechClient()

    const uri = FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingTypes.Base64,
    })

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 41000,
      languageCode: 'en-US',
    }

    const request = {
      config,
      audio: {
        content: uri,
      },
    }

    // detects speech in the audio file
    const [response] = await client.recognize(request)
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n')
    console.log(`Transcription: ${transcription}`)
    */
  } catch (err) {
    console.error('Error transcribing audio: ', err)
  }
}

export default getTranscription

import {functions} from '../Firebase'

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

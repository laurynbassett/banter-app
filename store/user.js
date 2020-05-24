import firebase, {db} from '../Firebase'
import {Notifications} from 'expo'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'

const usersRef = db.ref('users')

// ---------- ACTION TYPES ---------- //
const GET_USER = 'GET_USER'
const UPDATE_USER_NAME = 'UPDATE_USER_NAME'
const UPDATE_LANG = 'UPDATE_LANG'
const ADD_CHATROOM = 'ADD_CHATROOM'
const ADD_CONTACT = 'ADD_CONTACT'
const GET_CONTACTS = 'GET_CONTACTS'
const ADD_CONTACT_ERROR = 'ADD_CONTACT_ERROR'
const SET_NOTIFICATION_TOKEN = 'SET_NOTIFICATION_TOKEN'
const SET_NOTIFICATION_STATUS = 'SET_NOTIFICATION_STATUS'

// ---------- ACTION CREATORS ---------- //
const getUser = (user) => ({type: GET_USER, user})
const updateUserName = (name) => ({type: UPDATE_USER_NAME, name})
const updateLang = (lang) => ({type: UPDATE_LANG, lang})
const getContacts = (contacts) => ({type: GET_CONTACTS, contacts})
const addContact = (contact) => ({type: ADD_CONTACT, contact})
const addContactError = (message) => ({type: ADD_CONTACT_ERROR, message})

const setNotificationToken = (token) => ({
  type: SET_NOTIFICATION_TOKEN,
  token,
})
const setNotificationStatus = (status) => ({
  type: SET_NOTIFICATION_STATUS,
  status,
})

// ---------- THUNK CREATORS ---------- //

// GET USER
export const fetchUser = () => async (dispatch, getState) => {
  try {
    const uid = getState().firebase.auth.uid
    const snapshot = db.ref(`users/${uid}`)
    snapshot.once('value', (snapshot) => {
      const user = snapshot.val()
      // console.log("USER 0", user);
      user.id = snapshot.key

      if (user.chatrooms) {
        const chatrooms = Object.keys(user.chatrooms)
        user.chatrooms = chatrooms
      }
      delete user.contacts
      // console.log("USER", user);
      dispatch(getUser(user))
      return true
    })
  } catch (err) {
    console.log('Error adding new contact: ', err)
  }
}

// UPDATE USERNAME
export const putUserName = (firstName, lastName) => async (
  dispatch,
  getState
) => {
  try {
    const uid = getState().firebase.auth.uid
    const fullName = `${firstName} ${lastName}`
    await firebase
      .database()
      .ref('/users/' + uid)
      .update({name: fullName})
    dispatch(updateUserName(fullName))
  } catch (err) {
    console.error(err)
  }
}

// UPDATE LANGUAGE
export const putLang = (lang) => async (dispatch, getState) => {
  try {
    const uid = getState().firebase.auth.uid
    await firebase
      .database()
      .ref('/users/' + uid)
      .update({language: lang})
    dispatch(updateLang(lang))
  } catch (err) {
    console.error(err)
  }
}

// GET ALL CHATROOMS
export const fetchChatrooms = () => async (dispatch, getState) => {
  try {
    let chatrooms = []
    const uid = getState().firebase.auth.uid
    // get chatrooms from firebase via user node
    db.ref(`users/${uid}`).on('value', (user) => {
      if (user.child('chatrooms').exists()) {
        chatrooms = Object.keys(user.child('chatrooms').val())
      }
      dispatch(getChatrooms(chatrooms))
    })
  } catch (err) {
    console.log('Error fetching user chatrooms: ', err)
  }
}

// ADD NEW CHATROOM
export const addNewChatroom = (chatId, uid) => async () => {
  try {
    // check if user has chatrooms node
    usersRef.child(uid).once('value', (user) => {
      if (user.child('chatrooms').exists()) {
        // if chatrooms node exists, update with current chatId
        db.ref(`users/${uid}`)
          .child('chatrooms')
          .update({[chatId]: true})
      } else {
        // if chatrooms node doesn't exist, set it with current chatId
        db.ref(`users/${uid}`)
          .child('chatrooms')
          .set({[chatId]: true})
      }
    })
  } catch (err) {
    console.log('Error adding new chatroom: ', err)
  }
}

// GET ALL CONTACTS
export const fetchContacts = () => async (dispatch, getState) => {
  try {
    const uid = getState().firebase.auth.uid
    let allContacts = []
    let promises = []

    // get contacts via the user node
    db.ref(`users/${uid}/contacts`).on('value', (contacts) => {
      // for each contact, get additional info from their user node
      if (contacts.val()) {
        Object.keys(contacts.val()).forEach((contact) => {
          // push to array of promises
          promises.push(
            db.ref(`users/${contact}`).once('value', (snapshot) => {
              let newContact = snapshot.val()
              newContact.id = snapshot.key
              allContacts.push(newContact)
            })
          )
        })
      }
    })

    // wait for promises to resolve before dispatching getContacts
    await Promise.all(promises)
    dispatch(getContacts(allContacts))
  } catch (err) {
    console.log('Error fetching contacts: ', err)
  }
}

// ADD NEW CONTACT
export const addNewContact = ({email}, navigation) => async (
  dispatch,
  getState
) => {
  const errMsg = 'Please provide a valid email'
  try {
    const uid = getState().firebase.auth.uid
    const userRef = db.ref(`users/${uid}`)
    let snapshot = {}

    // check if user exists using email from add contact form
    if (email) {
      snapshot = await usersRef
        .orderByChild('email')
        .equalTo(email.toLowerCase())
        .once('value')
    }

    // if user exists, add to current user's contacts
    if (snapshot) {
      console.log('SNAPSHOT', snapshot)
      let id = Object.keys(snapshot.val())[0]
      let contact = snapshot.val()[id]
      contact.id = id
      userRef
        .child('contacts')
        .update({[id]: snapshot.val()[id].name})
        .then(() => {
          // add contact in redux store then navigate to all contacts screen
          dispatch(addContact(contact))
          navigation.navigate('Contacts', [
            {
              contacts: getState().user.contacts,
            },
          ])
        })
        .catch((error) => dispatch(addContactError(errMsg)))
    } else {
      // send error (contact doesn't exist)
      dispatch(addContactError(errMsg))
    }
  } catch (err) {
    console.log('Error adding new contact: ', err)
    dispatch(addContactError(errMsg))
  }
}

export const registerForPushNotificationsAsync = () => async (
  dispatch,
  getState
) => {
  // isDevice checks that user is not on a simulator, but actually on a real device
  try {
    const uid = getState().firebase.auth.uid
    const status = getState().user.notification.status

    if (Constants.isDevice) {
      // status returns either "undetermined", "granted", or "denied"
      // "undetermined" means the user has not either granted or denied when prompted
      // "granted" means the user answered yes to turning on push notifications
      // "denied" means the user rejected push notifications
      // source: https://docs.expo.io/versions/latest/sdk/permissions/#returns

      const {status: existingStatus} = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      )
      let finalStatus = existingStatus
      // console.log("EXISTING STATUS OF NOTIFICATION", existingStatus);
      // Don't want to ask the user every time they login
      if (existingStatus !== 'granted') {
        //This command initiates notification popup
        const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS)

        //IF permission is granted, finalStatus will === "granted"
        finalStatus = status
        // console.log("FINAL STATUS OF NOTIFICATION", finalStatus);
        // if finalStatus !== existingStatus --> update users/uid/notifications/status

        await firebase
          .database()
          .ref('/users/' + uid + '/notifications/')
          .update({status: finalStatus})

        dispatch(setNotificationStatus(finalStatus))
      }

      if (finalStatus !== 'granted') {
        return
      }

      // Store token in users/uid/notifications/token
      let token = await Notifications.getExpoPushTokenAsync()
      await firebase
        .database()
        .ref(`/users/${uid}/notifications/`)
        .update({token: token})

      // TODO: Persist token to store
      dispatch(setNotificationToken(token))
    } else {
      console.log('Must use physical device for Push Notifications')
    }
  } catch (err) {
    console.error(err)
  }
}

// ---------- INITIAL STATE ---------- //
const defaultUser = {
  id: '',
  name: '',
  email: '',
  phone: '',
  imageUrl: '',
  language: '',
  unseenCount: null,
  contacts: [],
  chatrooms: [],
  addContactError: '',
  notification: {},
}

// ---------- REDUCER ---------- //
const userReducer = (state = defaultUser, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        ...action.user,
      }
    case UPDATE_USER_NAME:
      return {...state, name: action.name}
    case UPDATE_LANG:
      return {...state, language: action.lang}
    case GET_CONTACTS:
      // console.log("IN GET CONTACTS", state);
      return {...state, contacts: action.contacts}
    case ADD_CONTACT:
      return {
        ...state,
        contacts: [...state.contacts, action.contact],
      }
    case ADD_CONTACT_ERROR:
      return {...state, addContactError: action.message}
    case SET_NOTIFICATION_TOKEN:
      return {
        ...state,
        notification: {...state.notification, token: action.token},
      }
    case SET_NOTIFICATION_STATUS:
      return {
        ...state,
        notification: {...state.notification, status: action.status},
      }
    default:
      return state
  }
}
export default userReducer

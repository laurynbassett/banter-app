import React, {Fragment} from 'react'
import {StyleSheet, Text, TouchableOpacity} from 'react-native'

import languages from '../languages.json'

export const getLangKey = (lang) => {
  return Object.keys(languages).find((key) => languages[key] === lang)
}

export const getLangValue = (langKey) => {
  return languages[langKey]
}

export const renderTranslation = (params, thisObj) => {
  return (
    <Fragment>
      {params.currentMessage.translatedFrom !== false && (
        <TouchableOpacity>
          <Text
            style={styles.showButton}
            onPress={() => {
              if (thisObj.state.originalsShown[params.currentMessage._id]) {
                thisObj.setState((prevState) => {
                  return {
                    originalsShown: {
                      ...prevState.originalsShown,
                      ...{
                        [params.currentMessage._id]: !thisObj.state
                          .originalsShown[params.currentMessage._id],
                      },
                    },
                  }
                })
              } else {
                thisObj.setState((prevState) => {
                  return {
                    originalsShown: {
                      ...prevState.originalsShown,
                      ...{[params.currentMessage._id]: true},
                    },
                  }
                })
              }
            }}
          >
            {thisObj.state.originalsShown[params.currentMessage._id]
              ? 'Hide Original'
              : 'Show Original'}
          </Text>
        </TouchableOpacity>
      )}
      <Text style={styles.messageBox}>
        {params.currentMessage.translatedFrom !== false
          ? `Translated From: ${params.currentMessage.translatedFrom}`
          : 'Not Translated'}
      </Text>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  messageBox: {
    color: 'grey',
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 1,
    paddingBottom: 10,
  },
  showButton: {
    color: 'rgb(102, 153, 255)',
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 1,
    paddingBottom: 5,
  },
})

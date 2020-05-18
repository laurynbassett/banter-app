const reset=(props)=> {
    const { navigate } = props.navigation
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login'})
      ],
      key: null // THIS LINE
    })
    this.props.navigation.dispatch(resetAction)
  }
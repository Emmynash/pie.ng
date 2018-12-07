const initialState = {
  isLoggedIn: false,
  token: null,
  user: {},
  errorMessage: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.user,
      }
    case 'SIGNUP_FAILED':
      return {
        ...state,
        isLoggedIn: false,
      }

    case 'VERIFICATION_SUCCESS':
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        user: {},
      }
    default:
      return state
  }
}
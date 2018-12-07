const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'BUSINESS_CREATED':
      return {
        ...state,
      }
    case 'BUSINESS_CREATION_FAILED':
      return {
        ...state,
      }
    default:
      return state
  }
}
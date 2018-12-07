export const isWorking = (state = false, action) => {
  switch(action.type) {
    case 'IO_OPEN':
      return true
    case 'IO_CLOSE':
      return false
    default:
      return state
  }
}

export const pageName = (state = '', action) => {
  switch(action.type) {
    case 'CHANGE_TITLE':
      return action.title
    default:
      return state
  }
}
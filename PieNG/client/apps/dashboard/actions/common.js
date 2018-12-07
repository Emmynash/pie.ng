export const isWorking = () => ({ type: 'IO_OPEN' })

export const isDoneWorking = () => ({ type: 'IO_CLOSE' })

export const setTitle = title => ({
  type: 'CHANGE_TITLE', title
})
import Promise from 'promise'
import * as auth from './user'
import * as toastr from './toastr'
import 'whatwg-fetch'

/* global fetch */

// import config from '../config/config.client'
/**
* TODO: Apply Axios defaults to every request
* https://github.com/mzabriskie/axios#global-axios-defaults
*/

const apiBaseUrl = config.apiUrl.concat('/api/v1/')/*global config*/

const authHeaders = () => ({
  'Authorization': auth.getToken() !== null ? `Bearer ${auth.getToken()}` : null,
  'x-access-token': auth.getToken() !== null ? auth.getToken() : null,
  'x-key': auth.getUser() !== null ? auth.getUser().id : null ,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
})

export const get = (endpoint) => {
  endpoint = apiBaseUrl + endpoint
  return new Promise((resolve, reject) => {
    fetch(endpoint, {
      headers: authHeaders()
    }).then(response => {
      try{
        if(response.status === 400){
			    return {
            message: response.statusText || 'Oopse! Something went wrong'
          }
			  }
        return response.json() 
      }catch(e){
        return {
          message: 'Oops! Something went wrong'
        }
      }
    }).then(responseJson => {
      resolve(responseJson)
    }).catch(error => {
      reject(error)
    })
  })
}

export const post = (endpoint, data) => {
  endpoint = apiBaseUrl.concat(endpoint)
  return new Promise((resolve, reject) => {
		fetch(endpoint, {
			method: 'POST',
			headers: authHeaders(),
			body: JSON.stringify(data)
		}).then(response => {
			try{
			  if(response.status === 400){
			    return {
            message: response.statusText || 'Oops! Something went wrong'
          }
			  }
        return response.json() 
      }catch(e){
        return {
          message: 'Oops! Something went wrong'
        }
      }
		}).then(responseJson => {
			resolve(responseJson)
		}).catch(error => {
			reject(error)
    })
	})
}

export const put = (endpoint, data) => {
  endpoint = apiBaseUrl.concat(endpoint)
  return new Promise((resolve, reject) => {
		fetch(endpoint, {
			method: 'PUT',
			headers: authHeaders(),
			body: JSON.stringify(data)
		}).then(response => {
			return response.json()
		}).then(responseJson => {
			resolve(responseJson)
		}).catch(error => {
		  toastr.error('Error', error.message || error)
			reject(error)
    })
	})
}
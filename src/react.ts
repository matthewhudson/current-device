import { useSyncExternalStore } from 'react'
import device from './index'
import type { DeviceOrientation, DeviceOs, DeviceType } from './index'

export type { DeviceOrientation, DeviceOs, DeviceType }

export interface DeviceState {
  type: DeviceType
  os: DeviceOs
  orientation: DeviceOrientation
}

// What the hooks return on the server and while hydrating: the server can't
// see the device, and the first client render has to match the server's HTML.
const serverState: DeviceState = {
  type: 'unknown',
  os: 'unknown',
  orientation: 'unknown',
}

let state: DeviceState | undefined

function subscribe(onChange: () => void): () => void {
  return device.onChangeOrientation(onChange)
}

// useSyncExternalStore needs the same object back until something changed.
// Only the orientation can change after the page has loaded.
function getState(): DeviceState {
  if (!state || state.orientation !== device.orientation) {
    state = { type: device.type, os: device.os, orientation: device.orientation }
  }
  return state
}

function getServerState(): DeviceState {
  return serverState
}

function getOrientation(): DeviceOrientation {
  return device.orientation
}

function getServerOrientation(): DeviceOrientation {
  return serverState.orientation
}

// The device's type, OS and orientation. Re-renders the component when the
// orientation changes.
export function useDevice(): DeviceState {
  return useSyncExternalStore(subscribe, getState, getServerState)
}

// The device's orientation. Re-renders the component when it changes.
export function useOrientation(): DeviceOrientation {
  return useSyncExternalStore(subscribe, getOrientation, getServerOrientation)
}

import React from 'react'
import type { ComponentType } from 'react'
import { useSnapshot } from 'valtio'


// Unfortunately, this doesn't work with tsc.
// Hope to find a solution to make this work.
//
//   class SnapshotWrapper<T extends object> {
//     fn(p: T) {
//       return snapshot(p)
//     }
//   }
//   type Snapshot<T extends object> = ReturnType<SnapshotWrapper<T>['fn']>
//
// Using copy-paste types for now:
type AsRef = { $$valtioRef: true }
type AnyFunction = (...args: any[]) => any
export type Snapshot<T> = T extends AnyFunction
  ? T
  : T extends AsRef
  ? T
  : T extends Promise<infer V>
  ? Snapshot<V>
  : {
      readonly [K in keyof T]: Snapshot<T[K]>
    }

function withProxy<
  Store extends object,
  P extends object,
  S extends object,
  A extends object
>(
  store: Store,
  C: ComponentType<P>,
  mapState?: (s: Store) => S,
  mapActions?: (s: Store) => A
) {
  return function WrappedComponent(props: Omit<P, keyof (S & A)>) {
    const snap = useSnapshot(store)
    const state = mapState?.(snap as Store) ?? {}
    const actions = mapActions?.(store) ?? {}
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // redux-react also ignore this type
    return <C {...props} {...state} {...actions} />
  }
}

/**
 * connect
 *
 * Wrap React class component
 */
export function connect<
  Store extends object,
  S extends object,
  A extends object
>(store: Store, mapState?: (s: Store) => S, mapActions?: (s: Store) => A) {
  return <P extends object>(C: ComponentType<P>) =>
    withProxy(store, C, mapState, mapActions)
}

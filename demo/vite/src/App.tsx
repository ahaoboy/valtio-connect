import { proxy } from 'valtio';
import React from 'react';
import { connect } from 'valtio-connect';
import type { Snapshot } from 'valtio-connect';
// import { connect } from '../../dist';
// import type { Snapshot } from '../../dist';


const store = proxy({ count: 1 });
const inc = () => {
  store.count++;
};
console.log('a', store);
type Store = typeof store;
type Snap = Snapshot<typeof store>;
const mapState = (snap: Snap) => {
  return {
    c: snap.count,
  };
};
const mapActions = (store: Store) => {
  return {
    inc,
    dec: () => {
      store.count--;
    },
  };
};
type MapState = ReturnType<typeof mapState>;
type MapActions = ReturnType<typeof mapActions>;
type Props = {};
class A extends React.Component<MapActions & MapState & Props> {
  render() {
    return (
      <div>
        <h2>c:{this.props.c}</h2>
        <button onClick={this.props.inc}>inc</button>
        <button onClick={this.props.dec}>dec</button>
      </div>
    );
  }
}

const C = connect(store, mapState, mapActions)(A);
function App() {
  return (
    <div>
      <C></C>
      <button onClick={() => store.count++}>inc count</button>
    </div>
  );
}
export default App;

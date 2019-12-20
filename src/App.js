import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import CollectionList from './views/Collection';
import Adventurers from './data/Adventurers.json';
import Dragons from './data/Dragons.json';

function initiateCollection(collectionItems, initialValue) {
  let initHaving = {};
  Object.keys(collectionItems).forEach(ele => {
    Object.keys(collectionItems[ele]).forEach(rare => {
      Object.keys(collectionItems[ele][rare]).forEach(adv => {
        initHaving[adv] = initialValue;
      })
    })
  });
  return initHaving;
}

function App() {
  const [collect, setCollect] = useState(
    {
      adv: initiateCollection(Adventurers, false),
      d: initiateCollection(Dragons, false)
    });
  const setAdvCollection = c => {
    setCollect({
      ...collect,
      adv: { ...collect.adv, ...c }
    })
  }
  const setDraCollection = c => {
    setCollect({
      ...collect,
      d: { ...collect.d, ...c }
    })
  }
  return (<BrowserRouter basename="/">
    <Switch>
      <Route exact path="/adventurers">
        <CollectionList
          collection={collect.adv}
          setCollection={setAdvCollection}
          collectionItems={Adventurers}
          itemType='Adventurers'
          prefix='adv' />
      </Route>
      <Route exact path="/dragons">
        <CollectionList
          collection={collect.d}
          setCollection={setDraCollection}
          collectionItems={Dragons}
          itemType='Dragons'
          prefix='d' />
      </Route>
      <Redirect to="/adventurers" />
    </Switch>
  </BrowserRouter>);
}

export default App;

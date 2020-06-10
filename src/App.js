import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import CollectionList from './views/Collection';
import { IconCheckList, IconCounterList } from './views/IconList';
import Adventurers from './data/Adventurers.json';
import Dragons from './data/Dragons.json';
import Weapons from './data/Weapons.json';
import Wyrmprints from './data/Wyrmprints.json';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
}

function initiateCollection(collectionItems) {
  const savedCollection = localStorage.getItem('dl-collection');
  let initHaving = {
    adv: {},
    d: {},
    w: {},
    wp: {}
  };
  if (savedCollection) {
    initHaving = JSON.parse(savedCollection);
  }
  Object.keys(collectionItems).forEach(type => {
    Object.keys(collectionItems[type]).forEach(ele => {
      Object.keys(collectionItems[type][ele]).forEach(rare => {
        collectionItems[type][ele][rare].forEach(thingy => {
          if (!initHaving[type].hasOwnProperty(thingy)) {
            initHaving[type][thingy] = 0;
          }
        });
      });
    });
  });
  return initHaving;
}

// function serializeCollect(collect) {
//   let collectStr = {
//     'adv': '',
//     'd': '',
//     'w': '',
//     'wp': ''
//   };
//   Object.keys(collect).forEach(type => {
//     Object.keys(collect[type]).forEach(item => {
//       if (collect[type][item] > 0) {
//         collectStr[type] += '|' + item + '#' + collect[type][item];
//       }
//     });
//   });
// }

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
function App() {
  const [collect, setCollect] = useState(initiateCollection({
    adv: Adventurers,
    d: Dragons,
    w: Weapons,
    wp: Wyrmprints,
  }));
  const [idx, setIdx] = useState(0);
  const handleChange = (e, newIdx) => {
    setIdx(newIdx);
  };

  const updateCollection = (c, key) => {
    const newCollect = {
      ...collect,
      [key]: { ...collect[key], ...c }
    };
    setCollect(newCollect);
    localStorage.setItem('dl-collection', JSON.stringify(newCollect));
  };

  const setAdvCollection = c => { updateCollection(c, 'adv') };
  const nextAdvRarity = r => {
    if (r.length === 3) {
      return ['r5'];
    } else if (r[0] === 'r5') {
      return ['r4'];
    } else if (r[0] === 'r4') {
      return ['r3'];
    } else {
      return ['r5', 'r4', 'r3'];
    }
  }
  const advRarityToString = r => {
    if (r.length === 3) {
      return 'All';
    } else {
      return `${r[0][1]}★`;
    }
  }

  const setDraCollection = c => { updateCollection(c, 'd') };
  const nextDraRarity = r => {
    if (r.length === 2) {
      return ['r5'];
    } else if (r[0] === 'r5') {
      return ['misc'];
    } else {
      return ['r5', 'misc'];
    }
  }
  const draRarityToString = r => {
    if (r.length === 2) {
      return 'All';
    } else if (r[0] === 'misc') {
      return `Others`;
    } else {
      return `Gacha 5★`;
    }
  }

  const setWepCollection = c => { updateCollection(c, 'w') };
  const nextWepRarity = r => {
    if (r.length > 1) {
      return ['Limited'];
    } else {
      return ['Agito2', 'Agito1', 'HDT2'];
    }
  }
  const wepRarityToString = r => {
    if (r.length === 2) {
      return 'Agito/HDT';
    } else {
      return r[0];
    }
  }

  const setWPCollection = c => { updateCollection(c, 'wp') };
  const nextWPRarity = r => {
    if (r[0] === 'Limited') {
      return ['Permanent'];
    } else {
      return ['Limited'];
    }
  }
  const wpRarityToString = r => {
    return r[0];
  }

  const direction = 'ltr';
  return (
    <React.Fragment>
      <AppBar position="static" color="default">
        <Tabs
          value={idx}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Adventurers" {...a11yProps(0)} />
          <Tab label="Dragons" {...a11yProps(1)} />
          <Tab label="Weapons" {...a11yProps(2)} />
          <Tab label="Wyrmprints" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={idx} index={0} dir={direction}>
        <CollectionList
          collection={collect.adv}
          setCollection={setAdvCollection}
          collectionItems={Adventurers}
          maxHaving={2}
          mubCount={2}
          checkAll={1}
          mubSymbol={'✪'}
          defaultRarity={['r5', 'r4', 'r3']}
          nextRarity={nextAdvRarity}
          rarityToString={advRarityToString}
          IconListComponent={IconCheckList}
          itemType='Adventurers'
          prefix='c' />
      </TabPanel>
      <TabPanel value={idx} index={1} dir={direction}>
        <CollectionList
          collection={collect.d}
          setCollection={setDraCollection}
          collectionItems={Dragons}
          maxHaving={20}
          mubCount={5}
          checkAll={5}
          mubSymbol={String.fromCharCode(10070)}
          defaultRarity={['r5']}
          nextRarity={nextDraRarity}
          rarityToString={draRarityToString}
          IconListComponent={IconCounterList}
          itemType='Dragons'
          prefix='d' />
      </TabPanel>
      <TabPanel value={idx} index={2} dir={direction}>
        <CollectionList
          collection={collect.w}
          setCollection={setWepCollection}
          collectionItems={Weapons}
          maxHaving={20}
          mubCount={5}
          checkAll={5}
          mubSymbol={String.fromCharCode(10070)}
          defaultRarity={['Agito2', 'Agito1', 'HDT2']}
          nextRarity={nextWepRarity}
          rarityToString={wepRarityToString}
          IconListComponent={IconCounterList}
          itemType='Weapons'
          prefix='w' />
      </TabPanel>
      <TabPanel value={idx} index={3} dir={direction}>
        <CollectionList
          collection={collect.wp}
          setCollection={setWPCollection}
          collectionItems={Wyrmprints}
          maxHaving={20}
          mubCount={5}
          checkAll={5}
          mubSymbol={String.fromCharCode(10070)}
          defaultRarity={['Limited']}
          nextRarity={nextWPRarity}
          rarityToString={wpRarityToString}
          IconListComponent={IconCounterList}
          itemType='Wyrmprint'
          prefix='wp' />
      </TabPanel>
    </React.Fragment>
  );
}

export default App;

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

function initiateCollection(collectionItems, initialValue) {
  let initHaving = {};
  Object.keys(collectionItems).forEach(ele => {
    Object.keys(collectionItems[ele]).forEach(rare => {
      collectionItems[ele][rare].forEach(adv => {
        initHaving[adv] = initialValue;
      })
    })
  });
  return initHaving;
}
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
function App() {
  const [collect, setCollect] = useState({
    adv: initiateCollection(Adventurers, 0),
    d: initiateCollection(Dragons, 0),
    w: initiateCollection(Weapons, 0),
    wp: initiateCollection(Wyrmprints, 0),
  });
  const [idx, setIdx] = useState(0);
  const handleChange = (e, newIdx) => {
    setIdx(newIdx);
  };

  const setAdvCollection = c => {
    setCollect({
      ...collect,
      adv: { ...collect.adv, ...c }
    })
  }
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

  const setDraCollection = c => {
    setCollect({
      ...collect,
      d: { ...collect.d, ...c }
    })
  }
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

  const setWepCollection = c => {
    setCollect({
      ...collect,
      w: { ...collect.w, ...c }
    })
  }
  const nextWepRarity = r => {
    if (r.length > 1) {
      return ['Limited'];
    } else {
      return ['HDT2', 'HDT1', 'Core', 'Void'];
    }
  }
  const wepRarityToString = r => {
    if (r.length === 4) {
      return 'All';
    } else {
      return r[0];
    }
  }

  const setWPCollection = c => {
    setCollect({
      ...collect,
      wp: { ...collect.wp, ...c }
    })
  }
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
          maxHaving={1}
          defaultRarity={['r5', 'r4', 'r3']}
          nextRarity={nextAdvRarity}
          rarityToString={advRarityToString}
          IconListComponent={IconCheckList}
          itemType='Adventurers'
          prefix='adv' />
      </TabPanel>
      <TabPanel value={idx} index={1} dir={direction}>
        <CollectionList
          collection={collect.d}
          setCollection={setDraCollection}
          collectionItems={Dragons}
          maxHaving={99}
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
          maxHaving={5}
          defaultRarity={['HDT2', 'HDT1', 'Core', 'Void']}
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

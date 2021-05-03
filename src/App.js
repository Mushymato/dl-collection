import React, { useState } from 'react';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Listing from './view/Listing';
import { CharaListingItem, DragonListingItem, WeaponListingItem, FortListingItem, AmuletListingItem, } from './view/ListingItems';

import TextLabel from './data/locale.json';
import Chara from './data/chara.json';
import Dragon from './data/dragon.json';
import Weapon from './data/weapon.json';
import Amulet from './data/amulet.json';
import Availabilities from './data/availabilities.json';
import WeaponSeries from './data/weaponseries.json';
import Fort from './data/fort.json';

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans", "Noto Sans SC", sans-serif ',
  }
});


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

const direction = 'ltr';

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function App() {
  const [idx, setIdx] = useState(parseInt(localStorage.getItem('dl-collection-tab')) || 0);
  const handleTabs = (e, newIdx) => {
    setIdx(newIdx);
    localStorage.setItem('dl-collection-tab', newIdx);
  };

  const [locale, setLocale] = useState(localStorage.getItem('dl-collection-locale') || 'EN');
  const nextLocale = (e) => {
    switch (locale) {
      case 'EN':
        localStorage.setItem('dl-collection-locale', 'JP');
        setLocale('JP');
        break;
      case 'JP':
        localStorage.setItem('dl-collection-locale', 'CN');
        setLocale('CN');
        break;
      case 'CN':
      default:
        localStorage.setItem('dl-collection-locale', 'EN');
        setLocale('EN');
        break;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" color="default">
        <Toolbar disableGutters={true}>
          <IconButton onClick={nextLocale} color="primary"><Box fontFamily="monospace">{locale}</Box></IconButton>
          <Tabs
            value={idx}
            onChange={handleTabs}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            style={{ margin: 'auto', width: '100%' }}
          >
            <Tab label={TextLabel[locale].ADVENTURERS} {...a11yProps(0)} />
            <Tab label={TextLabel[locale].DRAGONS} {...a11yProps(1)} />
            <Tab label={TextLabel[locale].AMULETS} {...a11yProps(2)} />
            <Tab label={TextLabel[locale].WEAPONS} {...a11yProps(3)} />
            <Tab label={TextLabel[locale].FACILITY} {...a11yProps(4)} />
          </Tabs>
        </Toolbar>
      </AppBar>
      <TabPanel value={idx} index={0} dir={direction}>
        <Listing
          locale={locale}
          entries={Chara}
          availabilities={Availabilities.Chara}
          storeKey={'chara'}
          minRarity={3}
          maxRarity={5}
          sortOptions={['byID', 'byName', 'byElement', 'byWeapon', 'byRarity']}
          radioFilters={['Element', 'Weapon', 'Rarity']}
          ItemComponent={CharaListingItem}
        />
      </TabPanel>
      <TabPanel value={idx} index={1} dir={direction}>
        <Listing
          locale={locale}
          entries={Dragon}
          availabilities={Availabilities.Dragon}
          storeKey={'dragon'}
          minRarity={3}
          maxRarity={5}
          sortOptions={['byID', 'byName', 'byElement', 'byRarity']}
          radioFilters={['Element', 'Rarity']}
          ItemComponent={DragonListingItem}
        />
      </TabPanel>
      <TabPanel value={idx} index={2} dir={direction}>
        <Listing
          locale={locale}
          entries={Amulet}
          availabilities={Availabilities.Amulet}
          storeKey={'amulet'}
          // cardIconFn={amuletCardIcon}
          minRarity={1}
          maxRarity={3}
          sortDefault={'byID'}
          sortOptions={['byID', 'byName', 'byRarity']}
          radioFilters={['Form', 'Union']}
          ItemComponent={AmuletListingItem}
        />
      </TabPanel>
      <TabPanel value={idx} index={3} dir={direction}>
        <Listing
          locale={locale}
          entries={Weapon}
          series={WeaponSeries}
          storeKey={'weapon'}
          minRarity={2}
          maxRarity={6}
          sortOptions={['byID', 'byName', 'byElement', 'byWeapon', 'byRarity', 'bySeries']}
          radioFilters={['Element', 'Weapon', 'Rarity']}
          ItemComponent={WeaponListingItem}
        />
      </TabPanel>
      <TabPanel value={idx} index={4} dir={direction}>
        <Listing
          locale={locale}
          entries={Fort}
          storeKey={'fort'}
          sortDefault={'byID'}
          sortOptions={['byID', 'byName', 'byType']}
          radioFilters={[]}
          ItemComponent={FortListingItem}
        />
      </TabPanel>
    </ThemeProvider>
  );
}

export default App;

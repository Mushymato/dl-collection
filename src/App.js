import React, { useState, Fragment } from 'react';

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
import { CharaListingControls } from './view/ListingControls';
import { CharaListingItem } from './view/ListingItems';

import TextLabel from './data/locale.json';
import Chara from './data/chara.json';
import Dragon from './data/dragon.json';
import Weapon from './data/weapon.json';
import Amulet from './data/amulet.json';

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans Condensed", "Noto Sans SC", sans-serif ',
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
  const [idx, setIdx] = useState(0);
  const handleTabs = (e, newIdx) => {
    setIdx(newIdx);
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
  const getLocale = () => {
    return TextLabel[locale];
  }

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
            variant="fullWidth"
            style={{ margin: 'auto', width: '100%' }}
          >
            <Tab label={getLocale().ADVENTURERS} {...a11yProps(0)} />
            <Tab label={getLocale().DRAGONS} {...a11yProps(1)} />
            <Tab label={getLocale().WEAPONS} {...a11yProps(2)} />
            <Tab label={getLocale().AMULETS} {...a11yProps(3)} />
          </Tabs>
        </Toolbar>
      </AppBar>
      <TabPanel value={idx} index={0} dir={direction}>
        <Listing
          locale={locale}
          entries={Chara}
          storeKey={'dl-collection-chara'}
          ControlComponent={CharaListingControls}
          ItemComponent={CharaListingItem}
        />
      </TabPanel>
      <TabPanel value={idx} index={1} dir={direction}>Bloop</TabPanel>
      <TabPanel value={idx} index={2} dir={direction}>Blorp</TabPanel>
      <TabPanel value={idx} index={3} dir={direction}>Blarg</TabPanel>
    </ThemeProvider>
  );
}

export default App;

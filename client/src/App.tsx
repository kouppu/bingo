import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './components/header';
import Footer from './components/footer';
import Bingo from './pages/bingo';
import Room from './pages/room';

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <header>
        <Header />
      </header>
      <main>
        <Switch>
          <Route path="/room/:id">
            <Room />
          </Route>
          <Route path="/">
            <Bingo />
          </Route>
        </Switch>
      </main>
      <footer>
        <Footer />
      </footer>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { initializeStore } from './store/store';
import FirestoreContextProvider from './components/FirestoreContextProvider';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Top from './pages/Top';
import Settings from './pages/Settings';
import Project from './pages/Project';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import SidebarMenu from './components/Common/SidebarMenu';

const store = initializeStore();

const App = () => {
  return (
    <div id="app" className="App">
      <Provider store={store}>
        <Auth>
          <BrowserRouter>
            <FirestoreContextProvider>
              <ScrollToTop>
                <Navbar />
                <div className="flex flex-wrap h-full">
                  <div className="w-full md:w-3/12 lg:w-3/12 bg-gray-100 pt-10">
                    <SidebarMenu />
                  </div>
                  <div className="w-full md:w-9/12 lg:w-9/12 bg-white">
                    <Switch>
                      <Route component={Top} exact path="/" />
                      <Route component={Settings} exact path="/settings" />
                      <Route component={Project} exact path="/project/:tag" />
                      <Route component={Profile} exact path="/@:username" />
                      <Route component={ResetPassword} exact path="/reset-password" />
                    </Switch>
                  </div>
                </div>
              </ScrollToTop>
            </FirestoreContextProvider>
          </BrowserRouter>
        </Auth>
      </Provider>
    </div>
  );
};

export default App;

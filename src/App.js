import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import ThemeProvider from './theme';

import { routes } from './route/routes';
import AuthProvider from './provider/sessionProvider';

function App() {
  // return (
  //   <HelmetProvider>
  //     <BrowserRouter>
  //       <ThemeProvider>
  //         <Router />
  //       </ThemeProvider>
  //     </BrowserRouter>
  //   </HelmetProvider>
  // );
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={routes} />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

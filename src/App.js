import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import ThemeProvider from './theme';

import { routes } from './route/routes';

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
        <RouterProvider router={routes} />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

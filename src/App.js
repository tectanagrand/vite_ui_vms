import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import ThemeProvider from './theme';

import { routes } from './route/routes';
import AuthProvider from './provider/sessionProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={routes} />
          </LocalizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

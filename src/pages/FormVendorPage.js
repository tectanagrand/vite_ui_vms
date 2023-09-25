import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NumericFormat } from 'react-number-format';
import { useState, useRef, useEffect, useReducer } from 'react';
import { VenBankTable } from 'src/components/FormVendor';
import { BankV } from 'src/_mock/Bank';
import { File } from 'src/_mock/File';
import UploadButton from 'src/components/common/UploadButton';

export default function FormVendorPage() {
  const initialForm = {
    is_draft: true,
    ticket_id: '',
  };

  const ven_detail = {
    ticket_num: '',
    ven_id: '',
    proc_id: '',
    name_1: '',
    title: '',
    street: '',
    telf1: '',
    fax: '',
    postal: '',
    email: '',
    is_pkp: false,
    npwp: '',
    pay_mthd: '',
    pay_term: '',
    is_tender: false,
    is_active: true,
    local_ovs: '',
    limit_vendor: 0,
    lim_curr: '',
    city: '',
    country: '',
  };

  const [ven_bank, setVen_bank] = useState([]);
  const [ven_file, setVen_file] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [expanded, setExpanded] = useState({
    panelReqDet: true,
    panelCompDet: true,
    panelAddr: true,
    panelTax: false,
    panelBank: false,
    panelFile: true,
  });
  const [header, setHeader] = useState({
    email_head: 'aaaa@xmail.com',
    dept_head: 'MXMS',
  });

  const formReducer = (state, action) => {
    switch (action.type) {
      case 'name': {
        return {
          ...state,
          name_1: action.name_1,
        };
      }
      case 'title': {
        return {
          ...state,
          title: action.title,
        };
      }
      case 'street': {
        return {
          ...state,
          street: action.street,
        };
      }
      case 'telf1': {
        return {
          ...state,
          telf1: action.telf1,
        };
      }
      case 'fax': {
        return {
          ...state,
          fax: action.fax,
        };
      }
      case 'postal': {
        return {
          ...state,
          postal: action.postal,
        };
      }
      case 'email': {
        return {
          ...state,
          email: action.email,
        };
      }
      case 'is_pkp': {
        return {
          ...state,
          is_pkp: action.is_pkp,
        };
      }
      case 'npwp': {
        return {
          ...state,
          npwp: action.npwp,
        };
      }
      case 'pay_mthd': {
        return {
          ...state,
          pay_mthd: action.pay_mthd,
        };
      }
      case 'pay_term': {
        return {
          ...state,
          pay_term: action.pay_term,
        };
      }
      case 'is_tender': {
        return {
          ...state,
          is_tender: action.is_tender,
        };
      }
      case 'local_ovs': {
        return {
          ...state,
          local_ovs: action.local_ovs,
        };
      }
      case 'limit_vendor': {
        return {
          ...state,
          limit_vendor: action.limit_vendor,
        };
      }
      case 'lim_curr': {
        return {
          ...state,
          lim_curr: action.lim_curr,
        };
      }
      case 'country': {
        return {
          ...state,
          country: action.country,
        };
      }
      case 'city': {
        return {
          ...state,
          city: action.city,
        };
      }
    }
  };

  const [state, dispatch] = useReducer(formReducer, ven_detail);

  const dynaCity = async () => {
    const cities = await fetch(`${process.env.REACT_APP_URL_LOC}/master/city`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ countryId: state.country }),
    });
    const response = await cities.json();
    const result = response.data;
    setCities(result.data);
  };

  const dynaCountry = async () => {
    const country = await fetch(`${process.env.REACT_APP_URL_LOC}/master/country`, {
      method: 'POST',
    });
    const response = await country.json();
    const result = response.data;
    setCountries(result.data);
  };

  useEffect(() => {
    dynaCountry();
    dynaCity();
    console.log(countries, cities);
  }, [state.country]);

  const setVen_bankFromChild = (newItem) => {
    setVen_bank(newItem);
    console.log(ven_bank);
  };

  const setVen_fileFromChild = (newItem) => {
    setVen_file(newItem);
    // console.log(newItem);
    // console.log(ven_file);
  };

  const handleSubmit = (event) => {
    console.log(ven_bank);
    console.log(ven_file);
  };

  const handleExpanded = (panel) => () => {
    if (panel === 'panelReqDet') {
      setExpanded({
        ...expanded,
        panelReqDet: expanded.panelReqDet ? false : true,
      });
    } else if (panel === 'panelCompDet') {
      setExpanded({
        ...expanded,
        panelCompDet: expanded.panelCompDet ? false : true,
      });
    } else if (panel === 'panelAddr') {
      setExpanded({
        ...expanded,
        panelAddr: expanded.panelAddr ? false : true,
      });
    } else if (panel === 'panelTax') {
      setExpanded({
        ...expanded,
        panelTax: expanded.panelTax ? false : true,
      });
    } else if (panel === 'panelBank') {
      setExpanded({
        ...expanded,
        panelBank: expanded.panelBank ? false : true,
      });
    } else if (panel === 'panelFile') {
      setExpanded({
        ...expanded,
        panelFile: expanded.panelFile ? false : true,
      });
    }
  };

  return (
    <>
      <Container>
        <Box sx={{ height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Form Vendor Registration
          </Typography>
        </Box>
        <Container>
          <Accordion expanded={expanded.panelReqDet} onChange={handleExpanded('panelReqDet')}>
            <AccordionSummary
              sx={{
                pointerEvents: 'none',
              }}
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    pointerEvents: 'auto',
                  }}
                />
              }
              id="panelReqDet"
            >
              <Typography>Requestor</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs>
                  <TextField
                    fullWidth
                    id="emailRequestor"
                    label="Email"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={header.email_head}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    fullWidth
                    id="deptRequestor"
                    label="Department"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={header.dept_head}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded.panelCompDet} onChange={handleExpanded('panelCompDet')}>
            <AccordionSummary
              sx={{
                pointerEvents: 'none',
              }}
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    pointerEvents: 'auto',
                  }}
                />
              }
              id="panelCompDet"
            >
              <Typography>Company Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    id="titleComp"
                    label="Title"
                    variant="outlined"
                    onChange={(e) => {
                      dispatch({ type: 'title', title: e.target.value });
                    }}
                    value={state.title}
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel id="local-ovs-label">Local / Overseas</InputLabel>
                    <Select
                      id="localOverseas"
                      labelId="local-ovs-label"
                      value={state.local_ovs}
                      label="Local / Overseas"
                      variant="outlined"
                      onChange={(e) => {
                        dispatch({ type: 'local_ovs', local_ovs: e.target.value });
                      }}
                    >
                      <MenuItem value={'LOCAL'}>Local</MenuItem>
                      <MenuItem value={'OVERSEAS'}>Overseas</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="nameComp"
                    label="Company Name"
                    variant="outlined"
                    value={state.name_1}
                    onChange={(e) => {
                      dispatch({ type: 'name', name_1: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumericFormat
                    value={state.limit_vendor}
                    prefix="IDR "
                    thousandSeparator
                    customInput={TextField}
                    label={'Limit Vendor'}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded.panelAddr} onChange={handleExpanded('panelAddr')}>
            <AccordionSummary
              sx={{
                pointerEvents: 'none',
              }}
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    pointerEvents: 'auto',
                  }}
                />
              }
              id="panelAddr"
            >
              <Typography>Address</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="countrySelect">Country</InputLabel>
                    <Select
                      id="countrySelect"
                      labelId="countrySelect"
                      label="Country"
                      variant="outlined"
                      value={state.country}
                      onChange={(e) => dispatch({ type: 'country', country: e.target.value })}
                    >
                      {countries.map((item) => (
                        <MenuItem id={item.country_code} key={item.code} value={item.country_code}>
                          {item.country_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    id="addressField"
                    label="Address"
                    value={state.street}
                    onChange={(e) => {
                      dispatch({ type: 'street', street: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    id="postalCode"
                    label="Postal Code"
                    value={state.postal}
                    onChange={(e) => {
                      dispatch({ type: 'postal', postal: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="City">City</InputLabel>
                    <Select
                      id="cityField"
                      label="City"
                      labelId="City"
                      variant="outlined"
                      value={state.city}
                      onChange={(e) => {
                        dispatch({ type: 'city', city: e.target.value });
                      }}
                    >
                      {cities.map((item) => (
                        <MenuItem id={item.code} key={item.code} value={item.city}>
                          {item.city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* <TextField fullWidth id="cityField" label="City" /> */}
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    id="telf1Field"
                    label="Telephone"
                    value={state.telf1}
                    onChange={(e) => {
                      dispatch({ type: 'telf1', telf1: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    id="faxField"
                    label="Fax"
                    value={state.fax}
                    onChange={(e) => {
                      dispatch({ type: 'fax', fax: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    value={state.telf1}
                    onChange={(e) => {
                      dispatch({ type: 'email', email: e.target.value });
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded.panelTax} onChange={handleExpanded('panelTax')}>
            <AccordionSummary
              sx={{
                pointerEvents: 'none',
              }}
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    pointerEvents: 'auto',
                  }}
                />
              }
            >
              <Typography>Tax and Payment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox id="is_PKP" />}
                      value={state.is_pkp}
                      onChange={(e) => {
                        console.log(e);
                        dispatch({ type: 'is_pkp', is_pkp: e.target.checked });
                      }}
                      label="Pengusaha Kena Pajak (PKP)"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={9}></Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="taxNumberField"
                    label="Tax Number (NPWP)"
                    value={state.npwp}
                    onChange={(e) => {
                      dispatch({ type: 'npwp', npwp: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="paymentMethodField">Payment Method</InputLabel>
                    <Select
                      id="paymentMethodLabel"
                      labelId="paymentMethodLabel"
                      variant="outlined"
                      value={state.pay_mthd}
                      onChange={(e) => {
                        dispatch({ type: 'pay_mthd', pay_mthd: e.target.value });
                      }}
                    >
                      <MenuItem>Bank</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="paymentTermField">Payment Term</InputLabel>
                    <Select
                      id="paymentTermField"
                      labelId="paymentTermField"
                      variant="outlined"
                      value={state.pay_term}
                      onChange={(e) => {
                        dispatch({ type: 'pay_term', pay_term: e.target.value });
                      }}
                    >
                      <MenuItem>30</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded.panelBank} onChange={handleExpanded('panelBank')}>
            <AccordionSummary
              sx={{
                pointerEvents: 'none',
              }}
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    pointerEvents: 'auto',
                  }}
                />
              }
            >
              <Typography>Bank Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <VenBankTable onChildDataChange={setVen_bankFromChild} initData={BankV} />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded.panelFile} onChange={handleExpanded('panelFile')}>
            <AccordionSummary
              sx={{
                pointerEvents: 'none',
              }}
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    pointerEvents: 'auto',
                  }}
                />
              }
            >
              <Typography>File Upload</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <UploadButton
                inputTypes={[
                  { key: 'SPPKP', value: 'SPPKP' },
                  { key: 'KTP', value: 'KTP' },
                ]}
                iniData={File}
                onChildDataChange={setVen_fileFromChild}
              />
            </AccordionDetails>
          </Accordion>
        </Container>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button sx={{ height: 50, width: 100, margin: 2 }} onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
}

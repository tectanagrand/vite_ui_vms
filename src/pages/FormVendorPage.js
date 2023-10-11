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
  FormHelperText,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NumericFormat } from 'react-number-format';
import { useState, useRef, useEffect } from 'react';
import { VenBankTable } from 'src/components/FormVendor';
import UploadButton from 'src/components/common/UploadButton';
import { useLoaderData, useParams } from 'react-router-dom';
import axios from 'axios';

export default function FormVendorPage() {
  const params = useParams();
  const loader_data = useLoaderData();
  const ttoken = params.token;
  const formtype = params.formtype;
  const initialForm = useRef({});
  const [local_ovs, setLocalovs] = useState('');
  const [lim_curr, setLimitCurr] = useState('');
  const [lim_ven, setLimven] = useState('');
  const [country_ven, setCountryven] = useState('');
  const [city_ven, setCityven] = useState('');
  const [pay_mthd, setPayMthd] = useState('');
  const [pay_term, setPayTerm] = useState('');

  const comp_name = useRef();
  const title = useRef();
  const address = useRef();
  const postalcode = useRef();
  const telf = useRef();
  const fax = useRef();
  const tax_num = useRef();
  const email_ven = useRef();
  const is_pkp = useRef();
  const banks = useRef();
  const ven_details = useRef();

  const [formStat, setFormStat] = useState({
    stat: false,
    type: 'info',
    message: '',
  });
  const [ven_bank, setVen_bank] = useState([]);
  const [ven_file, setVen_file] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [expanded, setExpanded] = useState({
    panelReqDet: true,
    panelCompDet: true,
    panelAddr: true,
    panelTax: true,
    panelBank: true,
    panelFile: true,
    panelVendetail: true,
  });
  const [loader, setLoader] = useState(true);
  let errObj = {};
  const errorFields = [
    'title',
    'local_ovs',
    'name_1',
    'lim_curr',
    'limit_vendor',
    'country',
    'street',
    'postal',
    'city',
    'telf1',
    'fax',
    'email',
    'npwp',
    'pay_mthd',
    'pay_term',
  ];
  errorFields.map((item) => {
    errObj[item] = {
      stat: false,
      message: '',
      touched: false,
    };
  });
  const [errorState, setErrorState] = useState(errObj);

  useEffect(() => {
    const getTimeout = setTimeout(() => {
      const dynaCity = async () => {
        try {
          const cities = await axios.post(`${process.env.REACT_APP_URL_LOC}/master/city`, { countryId: country_ven });
          const result = cities.data.data;
          setCities(result.data);
        } catch (err) {
          alert(err.stack);
        }
      };

      const dynaCountry = async () => {
        try {
          const country = await axios.post(`${process.env.REACT_APP_URL_LOC}/master/country`);
          const result = country.data.data;
          setCountries(result.data);
        } catch (err) {
          alert(err.stack);
        }
      };

      dynaCountry();
      dynaCity();
    }, 500);
    return () => clearTimeout(getTimeout);
  }, [country_ven]);

  useEffect(() => {
    const getCurr = async () => {
      try {
        const curr = await axios.get(`${process.env.REACT_APP_URL_LOC}/master/curr`);
        const response = curr.data;
        const result = response.data;
        let currobj = {};
        result.data.map((item) => {
          currobj[item.id_cur] = item.code;
        });
        setCurrencies(currobj);
      } catch (err) {
        alert(err.stack);
      }
    };

    const getBanks = async () => {
      try {
        const banksData = await axios.get(`${process.env.REACT_APP_URL_LOC}/master/bank`);
        const response = banksData.data;
        const result = response.data;
        banks.current = result.data;
      } catch (error) {
        alert(error.stack);
      }
    };

    const getTimeout = setTimeout(() => {
      getCurr();
      initialForm.current = {
        is_draft: false,
        ticket_id: ttoken,
        ticket_num: loader_data.data.ticket_id,
        ven_id: loader_data.data.ven_id,
        email_head: loader_data.data.email_proc,
        dept_head: loader_data.data.dep_proc,
        cur_pos: loader_data.data.cur_pos,
      };
      setLoader(false);
      getBanks();
    }, 500);
    return () => clearTimeout(getTimeout);
  }, []);

  const setVen_bankFromChild = (newItem) => {
    setVen_bank(newItem);
  };

  const setVen_fileFromChild = (newItem) => {
    setVen_file(newItem);
  };

  const handleSubmit = async (event) => {
    let isError = false;
    ven_details.current = {
      ven_id: initialForm.current.ven_id,
      ticket_num: initialForm.current.ticket_id,
      title: title.current.value.trim(),
      name_1: comp_name.current.value.trim(),
      local_ovs: local_ovs,
      limit_vendor: lim_ven ? lim_ven.match(/\d+/g)?.join('') : 0,
      lim_curr: lim_curr,
      postal: postalcode.current.value.trim(),
      country: country_ven,
      city: city_ven,
      street: address.current.value.trim(),
      telf1: telf.current.value.trim(),
      fax: fax.current.value.trim(),
      email: email_ven.current.value.trim(),
      is_pkp: is_pkp.current.checked,
      npwp: tax_num.current.value.trim(),
      pay_mthd: pay_mthd,
      pay_term: pay_term,
    };
    const jsonSend = {
      is_draft: initialForm.current.is_draft,
      ticket_id: initialForm.current.ticket_id,
      ven_detail: ven_details.current,
      ven_banks: ven_bank,
      ven_files: ven_file,
    };
    const newErrorState = {};
    Object.keys(ven_details.current).map(async (item) => {
      if (
        typeof ven_details.current[item] === 'string'
          ? ven_details.current[item]?.trim().length === 0
          : false ||
            ven_details.current[item] === '' ||
            ven_details.current[item] === 0 ||
            ven_details.current[item] === null ||
            ven_details.current[item] === undefined
      ) {
        newErrorState[item] = {
          stat: true,
          message: 'Please fill this field',
          touched: true,
        };
        isError = true;
      } else {
        let value = ven_details.current[item];
        const check = validateInput(item, value);
        if (check.stat == true) {
          newErrorState[item] = {
            stat: true,
            message: check.message,
            touched: true,
          };
        } else {
          newErrorState[item] = {
            stat: false,
            message: '',
            touched: true,
          };
        }
      }
    });
    setErrorState({ ...newErrorState, isError: isError });
    if (!isError) {
      setLoader(true);
      try {
        const submit = await axios.post(`${process.env.REACT_APP_URL_LOC}/ticket/form/submit`, jsonSend);
        const response = submit.data;
        setLoader(false);
        setFormStat({ stat: true, type: 'success', message: response.message });
      } catch (err) {
        alert(err.stack);
        setFormStat({ stat: true, type: 'error', message: 'error submitting' });
        setLoader(false);
      }
    } else {
      setFormStat({
        stat: true,
        type: 'error',
        message: 'Fields fill not allowed or still empty',
      });
    }
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
    } else if (panel === 'panelVendetail') {
      setExpanded({
        ...expanded,
        panelVendetail: expanded.panelVendetail ? false : true,
      });
    }
  };

  const handleErrCheck = (e) => {
    setTimeout(async () => {
      if (ven_details.current === undefined) {
        return;
      }
      const elem = e.target.name;
      ven_details.current[elem] = e.target.value;
      if (
        errorState[elem].touched &&
        (ven_details.current[elem] !== null ||
        ven_details.current[elem] !== undefined ||
        typeof ven_details.current[elem] === 'string'
          ? ven_details.current[elem]?.trim().length !== 0
          : false || ven_details.current[elem] !== 0 || ven_details.current[elem] !== '')
      ) {
        let value = ven_details.current[elem];
        const check = validateInput(elem, value);
        console.log(check);
        if (check.stat == true) {
          setErrorState((errorState) => ({
            ...errorState,
            [elem]: {
              stat: true,
              message: check.message,
              touched: true,
            },
          }));
        } else {
          setErrorState((errorState) => ({
            ...errorState,
            [elem]: {
              stat: false,
              message: '',
              touched: true,
            },
          }));
        }
      } else {
        setErrorState((errorState) => ({
          ...errorState,
          [elem]: {
            stat: true,
            message: 'Please fill this field',
            touched: true,
          },
        }));
      }
    }, 500);
  };

  const handleSnackClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFormStat({ ...formStat, stat: false });
  };

  const validateInput = (field, value) => {
    let regexpat = '';
    switch (field) {
      case 'email':
        console.log('check - ' + value);
        regexpat = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        if (!regexpat.test(value)) {
          return { stat: true, message: 'Please fill email field' };
        } else {
          return { stat: false, message: '' };
        }
      case 'postal':
        regexpat = /[0-9]/;
        if (!regexpat.test(value)) {
          return { stat: true, message: 'Please input just numeric value' };
        } else {
          return { stat: false, message: '' };
        }
      case 'street':
        if (value?.trim().length > 30) {
          return { stat: true, message: 'Please input below 30 characters' };
        } else {
          return { stat: false, message: '' };
        }
      case 'name_1':
        if (value?.trim().length > 35) {
          return { stat: true, message: 'Please input below 30 characters' };
        } else {
          return { stat: false, message: '' };
        }
      default:
        return { stat: false, message: '' };
    }
  };

  if (
    Object.keys(initialForm.current).length !== 0 &&
    initialForm.current.cur_pos !== 'VENDOR' &&
    formtype === 'newform'
  ) {
    return (
      <>
        <Container
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1>Ticket {initialForm.current.ticket_num} already Submitted</h1>
        </Container>
      </>
    );
  } else {
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
                      value={initialForm.current.email_head ? initialForm.current.email_head : ''}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      id="deptRequestor"
                      label="Department"
                      variant="outlined"
                      value={initialForm.current.dept_head ? initialForm.current.dept_head : ''}
                      InputProps={{
                        readOnly: true,
                      }}
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
                      name="title"
                      inputRef={title}
                      error={errorState['title'].stat}
                      helperText={errorState['title'].stat && errorState['title'].message}
                      onChange={handleErrCheck}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel error={errorState.local_ovs.stat} id="local-ovs-label">
                        Local / Overseas
                      </InputLabel>
                      <Select
                        id="localOverseas"
                        labelId="local-ovs-label"
                        label="Local / Overseas"
                        variant="outlined"
                        name="local_ovs"
                        value={local_ovs}
                        onChange={(e) => {
                          setLocalovs(e.target.value);
                          handleErrCheck(e);
                        }}
                        error={errorState.local_ovs.stat}
                      >
                        <MenuItem value={'LOCAL'}>Local</MenuItem>
                        <MenuItem value={'OVERSEAS'}>Overseas</MenuItem>
                      </Select>
                      <FormHelperText error={errorState.local_ovs.stat}>
                        {errorState.local_ovs.stat && errorState.local_ovs.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="name_1"
                      label="Company Name"
                      variant="outlined"
                      name="name_1"
                      inputRef={comp_name}
                      error={errorState.name_1.stat}
                      helperText={errorState.name_1.stat && errorState.name_1.message}
                      onChange={handleErrCheck}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel error={errorState.lim_curr.stat} id="limCurrLabel">
                        Limit Currency
                      </InputLabel>
                      <Select
                        id="limCurr"
                        labelId="limCurrLabel"
                        value={lim_curr}
                        label="Limit Currency"
                        variant="outlined"
                        name="lim_curr"
                        onChange={(e) => {
                          setLimitCurr(e.target.value);
                          handleErrCheck(e);
                        }}
                        error={errorState.lim_curr.stat}
                      >
                        {Object.keys(currencies).map((id) => (
                          <MenuItem id={id} value={id} key={id}>
                            {currencies[id]}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={errorState.lim_curr.stat}>
                        {errorState.lim_curr.stat && errorState.lim_curr.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <NumericFormat
                      value={lim_ven}
                      prefix={currencies[lim_curr] + ' '}
                      thousandSeparator
                      customInput={TextField}
                      label={'Limit Vendor'}
                      fullWidth
                      name="limit_vendor"
                      onChange={(e) => {
                        setTimeout(() => {
                          setLimven(e.target.value.replace(`-?\\d+(\\.\\d+)?`, ''));
                          handleErrCheck(e);
                        }, 1000);
                      }}
                      error={errorState.limit_vendor.stat}
                      helpertext={errorState.limit_vendor.message}
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
                      <InputLabel error={errorState.country.stat} id="countrySelectLabel" htmlFor="countrySelect">
                        Country
                      </InputLabel>
                      <Select
                        id="countrySelect"
                        labelId="countrySelectLabel"
                        label="Country"
                        name="country"
                        variant="outlined"
                        value={country_ven}
                        onChange={(e) => {
                          setTimeout(() => {
                            setCountryven(e.target.value);
                          }, 300);
                          handleErrCheck(e);
                        }}
                        error={errorState.country.stat}
                      >
                        {countries.map((item, idx) => (
                          <MenuItem key={`${item.country_id}_${idx}`} value={item.country_code}>
                            {item.country_name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={errorState.country.stat}>
                        {errorState.country.stat && errorState.country.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      id="addressField"
                      label="Address"
                      name="street"
                      inputRef={address}
                      error={errorState.street.stat}
                      helperText={errorState.street.stat && errorState.street.message}
                      onChange={handleErrCheck}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      id="postalCode"
                      label="Postal Code"
                      name="postal"
                      inputRef={postalcode}
                      error={errorState.postal.stat}
                      helperText={errorState.postal.stat && errorState.postal.message}
                      onChange={handleErrCheck}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel error={errorState.city.stat} htmlFor="City">
                        City
                      </InputLabel>
                      <Select
                        id="cityField"
                        label="City"
                        labelId="City"
                        variant="outlined"
                        name="city"
                        value={city_ven}
                        onChange={(e) => {
                          setCityven(e.target.value);
                          handleErrCheck(e);
                        }}
                        error={errorState.city.stat}
                      >
                        {cities.map((item) => (
                          <MenuItem id={item.code} key={item.code} value={item.city}>
                            {item.city}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={errorState.city.stat}>
                        {errorState.city.stat && errorState.city.message}
                      </FormHelperText>
                    </FormControl>
                    {/* <TextField fullWidth id="cityField" label="City" /> */}
                  </Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      id="telf1Field"
                      label="Telephone"
                      name="telf1"
                      inputRef={telf}
                      error={errorState.telf1.stat}
                      helperText={errorState.telf1.stat && errorState.telf1.message}
                      onChange={handleErrCheck}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      id="faxField"
                      label="Fax"
                      name="fax"
                      inputRef={fax}
                      error={errorState.fax.stat}
                      helperText={errorState.fax.stat && errorState.fax.message}
                      onChange={handleErrCheck}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      inputRef={email_ven}
                      error={errorState.email.stat}
                      helperText={errorState.email.stat && errorState.email.message}
                      onChange={handleErrCheck}
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
                        control={<Checkbox id="is_PKP" inputRef={is_pkp} />}
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
                      name="npwp"
                      inputRef={tax_num}
                      error={errorState.npwp.stat}
                      helperText={errorState.npwp.stat && errorState.npwp.message}
                      onChange={handleErrCheck}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel error={errorState.pay_mthd.stat} htmlFor="paymentMethodField">
                        Payment Method
                      </InputLabel>
                      <Select
                        id="paymentMethodLabel"
                        labelId="paymentMethodLabel"
                        variant="outlined"
                        label="Payment Method"
                        name="pay_mthd"
                        value={pay_mthd}
                        onChange={(e) => {
                          setPayMthd(e.target.value);
                          handleErrCheck(e);
                        }}
                        error={errorState.pay_mthd.stat}
                      >
                        <MenuItem value={'bank'}>Bank</MenuItem>
                      </Select>
                      <FormHelperText error={errorState.pay_mthd.stat}>
                        {errorState.pay_mthd.stat && errorState.pay_mthd.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel error={errorState.pay_term.stat} htmlFor="paymentTermField">
                        Payment Term
                      </InputLabel>
                      <Select
                        id="paymentTermField"
                        labelId="paymentTermField"
                        label="Payment Term"
                        name="pay_term"
                        variant="outlined"
                        value={pay_term}
                        onChange={(e) => {
                          setPayTerm(e.target.value);
                          handleErrCheck(e);
                        }}
                        error={errorState.pay_term.stat}
                      >
                        <MenuItem value={'30'}>30</MenuItem>
                      </Select>
                      <FormHelperText error={errorState.pay_term.stat}>
                        {errorState.pay_term.stat && errorState.pay_term.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {(initialForm.current.cur_pos === 'PROC' || initialForm.current.cur_pos === 'MDM') && (
              <Accordion expanded={expanded.panelVendetail} onChange={handleExpanded('panelVendetail')}>
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
                  <Typography>Vendor Details</Typography>
                </AccordionSummary>
              </Accordion>
            )}
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
                <VenBankTable
                  onChildDataChange={setVen_bankFromChild}
                  initData={{}}
                  idParent={initialForm.current.ven_id}
                  banks={banks.current}
                />
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
                  iniData={{}}
                  idParent={initialForm.current.ven_id}
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
          <Snackbar
            open={formStat.stat}
            onClose={handleSnackClose}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert severity={formStat.type} onClose={handleSnackClose} variant="filled">
              {formStat.message}
            </Alert>
          </Snackbar>
          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Container>
      </>
    );
  }
}

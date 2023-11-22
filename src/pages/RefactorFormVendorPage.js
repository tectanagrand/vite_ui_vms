import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Dialog,
  Skeleton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useRef, useEffect, useMemo } from 'react';
import { VenBankTable } from 'src/components/FormVendor';
import UploadButton from 'src/components/common/UploadButton';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSession } from 'src/provider/sessionProvider';
import { TextFieldComp } from 'src/components/common/TextFieldComp';
import SelectComp from 'src/components/common/SelectComp';
import CheckboxComp from 'src/components/common/CheckboxComp';
import NumericFieldComp from 'src/components/common/NumericFieldComp';
import { useForm } from 'react-hook-form';

const ventypeList = {
  '3RD_PARTY': [
    { value: 'MATERIAL', label: 'Material' },
    { value: 'CONTRACTOR', label: 'Contractor' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'ONE_TIME', label: 'One Time' },
    { value: 'OTHER', label: 'Other' },
    { value: 'TRANSPORTER', label: 'Transporter' },
  ],
  INTERCO: [
    { value: 'MATERIAL', label: 'Material' },
    { value: 'CONTRACTOR', label: 'Contractor' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'OTHER', label: 'Other' },
    { value: 'TRANSPORTER', label: 'Transporter' },
  ],
  RELATED: [
    { value: 'MATERIAL', label: 'Material' },
    { value: 'CONTRACTOR', label: 'Contractor' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'OTHER', label: 'Other' },
    { value: 'TRANSPORTER', label: 'Transporter' },
  ],
};

export default function RefactorFormVendorPage() {
  const loader_data = useLoaderData();

  const params = useParams();
  const [chgCountry, setChgCty] = useState(loader_data.data.country);
  const [chgVengrp, setVengrp] = useState('');
  const [chgVenacc, setVenacc] = useState('');
  const [chgCurr, setChgCurr] = useState('');
  const defaultValue = {
    emailRequestor: '',
    deptRequestor: '',
    titlecomp: '',
    localovs: '',
    name1: '',
    country: '',
    street: '',
    postal: '',
    city: '',
    telf: '',
    fax: '',
    email: '',
    ispkp: false,
    npwp: '',
    paymthd: '',
    payterm: '',
    company: '',
    purchorg: '',
    vengroup: '',
    venacc: '',
    ventype: '',
    currency: '',
    description: '',
    is_tender: false,
    vendorcode: '',
    remarks: '',
    limit: '',
  };

  const funChgCountry = (item) => {
    setChgCty(item);
    countrycode.current = item;
  };
  const funChgVgrp = (item) => {
    setVengrp(item);
  };
  const funChgVacc = (item) => {
    setVenacc(item);
  };
  const funChgCurr = (item) => {
    setChgCurr(item);
  };

  const { handleSubmit, control } = useForm({ defaultValues: loader_data.data });
  const navigate = useNavigate();
  const { session, getPermission } = useSession();
  const ticketState = loader_data.ticketState;
  const ttoken = params.token;
  const initialForm = useRef({});
  const countrycode = useRef(loader_data.data.country);

  let permissions = {};
  if (loader_data.permission != undefined) {
    permissions = loader_data.permission;
  } else {
    permissions.INIT = getPermission('Initial Form');
    permissions.CREA = getPermission('Creation Form');
    permissions.FINA = getPermission('Final Form');
  }
  console.log(permissions);
  const UPDATE = {
    INIT: permissions.INIT.update,
    CREA: permissions.CREA.update,
    FINA: permissions.FINA.update,
  };

  const countries = useRef([{ value: '', label: '' }]);
  const currencies = useRef([{ value: '', label: '' }]);
  // const cities = useRef([{ value: '', label: '' }]);
  const banks = useRef([]);
  const comps = useRef([{ value: '', label: '' }]);
  const initDataBank = useRef({});
  const initDataFile = useRef({});

  const [cities, setCities] = useState([{ value: '', label: '' }]);
  const [is_draft, setDraft] = useState(false);

  const vengroups = [
    { value: '3RD_PARTY', label: '3RD Party' },
    { value: 'BANK', label: 'Bank' },
    { value: 'SHAREHOLDERS', label: 'Shareholders' },
    { value: 'EMPLOYEE', label: 'Employee' },
    { value: 'INTERDIVISION', label: 'Interdivision' },
    { value: 'RELATED', label: 'Related' },
  ];

  const title = [
    { value: 'COMPANY', label: 'COMPANY' },
    { value: 'PERSONAL', label: 'PERSONAL' },
  ];

  const localoverseas = [
    { value: 'LOCAL', label: 'Local' },
    {
      value: 'OVS',
      label: 'Overseas',
    },
  ];

  const [formStat, setFormStat] = useState({
    stat: false,
    type: 'info',
    message: '',
  });
  const [ven_bank, setVen_bank] = useState([]);
  const [ven_file, setVen_file] = useState([]);
  const [expanded, setExpanded] = useState({
    panelReqDet: true,
    panelCompDet: true,
    panelAddr: true,
    panelTax: true,
    panelBank: true,
    panelFile: true,
    panelVendetail: true,
    panelApproval: true,
  });

  const [loader, setLoader] = useState(true);
  const [fileLoad, setFileLoad] = useState(false);
  const [bankLoad, setBankLoad] = useState(false);
  const [banksLoad, setBanksLoad] = useState(false);
  const [currLoad, setCurrLoad] = useState(false);
  const [countryLoad, setCountryLoad] = useState(false);

  useMemo(() => ({ cities, countries, currencies }), [cities, countries, currencies]);
  //set active section

  useEffect(() => {
    const dynaCity = async () => {
      try {
        const getcities = await axios.post(`${process.env.REACT_APP_URL_LOC}/master/city`, {
          countryId: countrycode.current,
        });
        const result = getcities.data.data;
        const convcity = result.data.map((item) => ({
          value: item.code,
          label: item.city,
        }));
        setCities(convcity);
      } catch (err) {
        alert(err.stack);
      }
    };
    dynaCity();
  }, [chgCountry]);

  useEffect(() => {
    const dynaCountry = async () => {
      try {
        const country = await axios.post(`${process.env.REACT_APP_URL_LOC}/master/country`);
        const result = country.data.data;
        countries.current = result.data.map((item) => ({
          value: item.country_code,
          label: item.country_name,
        }));
        setCountryLoad(true);
      } catch (err) {
        alert(err.stack);
      }
    };

    const getCurr = async () => {
      try {
        const curr = await axios.get(`${process.env.REACT_APP_URL_LOC}/master/curr`);
        const response = curr.data;
        const result = response.data;
        currencies.current = result.data.map((item) => ({
          value: item.code,
          label: item.code,
        }));
        setCurrLoad(true);
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
        setBanksLoad(true);
      } catch (error) {
        alert(error.stack);
      }
    };

    const getInitDataBank = async () => {
      try {
        const bankInit = await axios.get(`${process.env.REACT_APP_URL_LOC}/vendor/bank/${loader_data.ven_id}`);
        const result = bankInit.data.data;
        initDataBank.current = result.data;
        setBankLoad(true);
      } catch (err) {
        alert(err.stack);
      }
    };

    const getInitDataFile = async () => {
      try {
        const fileInit = await axios.get(`${process.env.REACT_APP_URL_LOC}/vendor/file/${loader_data.ven_id}`);
        const result = fileInit.data.data;
        initDataFile.current = result.data;
        setFileLoad(true);
      } catch (err) {
        alert(err.stack);
      }
    };

    const getCompany = async () => {
      try {
        const compsData = await axios.get(`${process.env.REACT_APP_URL_LOC}/master/company`);
        const response = compsData.data;
        const result = response.data;
        comps.current = result.data.map((item) => ({
          value: item.comp_id,
          label: item.code + ' - ' + item.name,
        }));
      } catch (error) {
        alert(error.stack);
      }
    };
    dynaCountry();
    getCurr();
    getBanks();
    getInitDataBank();
    getInitDataFile();
    getCompany();
  }, []);

  const setVen_bankFromChild = (newItem) => {
    setVen_bank(newItem);
  };

  const setVen_fileFromChild = (newItem) => {
    setVen_file(newItem);
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
    } else if (panel === 'panelApproval') {
      setExpanded({
        ...expanded,
        panelApproval: expanded.panelApproval ? false : true,
      });
    }
  };

  const handleSnackClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFormStat({ ...formStat, stat: false });
  };

  const handleReject = async () => {
    setLoader(true);
    // try {
    //   const rejectParams = {
    //     ticket_id: initialForm.current.ticket_id,
    //     remarks: remarks.current.value,
    //   };
    //   const resultReject = await axios.patch(`${process.env.REACT_APP_URL_LOC}/ticket/reject`, rejectParams);
    //   const response = resultReject.data;
    //   setFormStat({ stat: true, type: 'success', message: response.message });
    //   setLoader(false);
    //   navigate(0);
    // } catch (error) {
    //   setLoader(false);
    //   alert(error);
    // }
  };

  const submitForm = async (value) => {
    const ven_detail = {
      ven_id: loader_data.ven_id,
      ticket_num: loader_data.ticket_num,
      title: value.titlecomp,
      name_1: value.name1,
      local_ovs: value.localovs,
      postal: value.postal,
      country: value.country,
      city: value.city,
      street: value.street,
      telf1: value.telf,
      fax: value.fax,
      email: value.email,
      is_pkp: value.ispkp,
      is_tender: value.is_tender,
      npwp: value.npwp.trim(),
      pay_mthd: value.paymthd,
      pay_term: value.payterm,
    };
    const jsonSend = {
      role: session.role === undefined ? 'VENDOR' : session.role,
      is_draft: is_draft,
      ticket_id: loader_data.ticket_id,
      remarks: value.remarks,
      ven_detail: ven_detail,
      ven_banks: ven_bank,
      ven_files: ven_file,
    };
    try {
      let submit;
      if (session.role === undefined) {
        submit = await axios.post(`${process.env.REACT_APP_URL_LOC}/ticket/newform/submit`, jsonSend);
      } else {
        submit = await axios.post(`${process.env.REACT_APP_URL_LOC}/ticket/form/submit`, jsonSend);
      }
      const response = submit.data;
      setFormStat({ stat: true, type: 'success', message: response.message });
      setLoader(false);
      if (!is_draft) {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      console.log(err.stack);
      alert(err.stack);
      setFormStat({ stat: true, type: 'error', message: 'error submitting' });
      setLoader(false);
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box sx={{ height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {`Form Vendor Registration `}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(submitForm)}>
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
                    <TextFieldComp name="emailRequestor" label="Email Requestor" control={control} readOnly={true} />
                  </Grid>
                  <Grid item xs>
                    <TextFieldComp name="deptRequestor" label="Departement" control={control} readOnly={true} />
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
                    <SelectComp
                      name="titlecomp"
                      label="Title"
                      control={control}
                      readOnly={!UPDATE.INIT}
                      options={title}
                      rules={{ required: 'Please insert this field' }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <SelectComp
                      name="localovs"
                      label="Local / Overseas"
                      control={control}
                      readOnly={!UPDATE.INIT}
                      options={localoverseas}
                      rules={{ required: 'Please insert this field' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldComp
                      name="name1"
                      label="Company Name"
                      control={control}
                      readOnly={!UPDATE.INIT}
                      rules={{
                        required: 'Please insert this field',
                        maxLength: { value: 300, message: 'Max 300 Character' },
                      }}
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
                    <SelectComp
                      name="country"
                      label="Country"
                      control={control}
                      readOnly={!UPDATE.INIT}
                      options={countries.current}
                      onChangeovr={funChgCountry}
                      rules={{
                        required: 'Please insert this field',
                      }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <TextFieldComp
                      name="street"
                      label="Address"
                      control={control}
                      readOnly={!UPDATE.INIT}
                      rules={{
                        required: 'Please insert this field',
                        maxLength: { value: 300, message: 'Max 300 Character' },
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextFieldComp
                      name="postal"
                      label="Postal Code"
                      control={control}
                      readOnly={!UPDATE.INIT}
                      rules={{
                        required: 'Please insert this field',
                        maxLength: { value: 300, message: 'Max 300 Character' },
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <SelectComp
                      name="city"
                      label="City"
                      control={control}
                      readOnly={!UPDATE.INIT}
                      options={cities}
                      rules={{
                        required: 'Please insert this field',
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={3}>
                    <TextFieldComp
                      name="telf"
                      label="Telephone Number"
                      control={control}
                      readOnly={!UPDATE.INIT}
                      rules={{
                        required: 'Please insert this field',
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextFieldComp
                      name="fax"
                      label="Fax"
                      control={control}
                      readOnly={!UPDATE.INIT}
                      rules={{
                        required: 'Please insert this field',
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextFieldComp
                      name="email"
                      label="Email"
                      control={control}
                      readOnly={!UPDATE.INIT}
                      rules={{
                        required: 'Please insert this field',
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
                    <CheckboxComp
                      name="ispkp"
                      label="Pengusaha Kena Pajak (PKP)"
                      control={control}
                      readOnly={!UPDATE.INIT}
                    />
                  </Grid>
                  <Grid item xs={9}></Grid>
                  <Grid item xs={6}>
                    <TextFieldComp
                      name="npwp"
                      label="Tax Number"
                      control={control}
                      readOnly={!UPDATE.INIT}
                      rules={{ required: 'Please insert this field' }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <SelectComp
                      name="paymthd"
                      label="Payment Method"
                      control={control}
                      options={[{ value: 'bank', label: 'Bank' }]}
                      readOnly={!UPDATE.INIT}
                      rules={{
                        required: 'Please insert this field',
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <SelectComp
                      name="payterm"
                      label="Payment Term"
                      control={control}
                      options={[{ value: '30', label: '30' }]}
                      readOnly={!UPDATE.INIT}
                      rules={{
                        required: 'Please insert this field',
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {(ticketState === 'CREA' || ticketState === 'FINA') && (
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
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <SelectComp
                        name="company"
                        label="Company"
                        control={control}
                        options={comps.current}
                        readOnly={!UPDATE.CREA}
                        rules={{
                          required: 'Please insert this field',
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextFieldComp
                        name="purchorg"
                        label="Purchasing Organization"
                        control={control}
                        readOnly={!UPDATE.CREA}
                        rules={{
                          required: 'Please insert this field',
                          maxLength: { value: 20, message: 'Max 20 Character' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={3}>
                      <SelectComp
                        name="vengroup"
                        label="Vendor Group"
                        control={control}
                        options={vengroups}
                        onChangeovr={funChgVgrp}
                        readOnly={!UPDATE.CREA}
                        rules={{
                          required: 'Please insert this field',
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <SelectComp
                        name="venacc"
                        label="Vendor Account"
                        control={control}
                        options={[
                          { value: 'TRADE', label: 'Trade' },
                          { value: 'NON_TRADE', label: 'Non Trade' },
                        ]}
                        onChangeovr={funChgVacc}
                        readOnly={!UPDATE.CREA}
                        rules={{
                          required: 'Please insert this field',
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <SelectComp
                        name="ventype"
                        label="Vendor Type"
                        control={control}
                        options={chgVenacc === 'TRADE' ? ventypeList[chgVengrp] : [{ value: 'X', label: 'X' }]}
                        readOnly={!UPDATE.CREA}
                        rules={{
                          required: 'Please insert this field',
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={3}>
                      <SelectComp
                        name="currency"
                        label="Limit Currency"
                        control={control}
                        options={currencies.current}
                        onChangeovr={funChgCurr}
                        readOnly={!UPDATE.CREA}
                        rules={{
                          required: 'Please insert this field',
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <NumericFieldComp
                        name="limit"
                        label="Limit"
                        control={control}
                        format={['thousandSeparator']}
                        currency={chgCurr}
                        readOnly={!UPDATE.CREA}
                        rules={{
                          required: 'Please insert this field',
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={12}>
                      <TextFieldComp name="description" label="Description" control={control} readOnly={!UPDATE} />
                    </Grid>
                    <Grid item xs={5}>
                      <CheckboxComp
                        name="is_tender"
                        label="Tender Participation Above One Billion"
                        control={control}
                        readOnly={!UPDATE.CREA}
                        rules={{
                          required: 'Please insert this field',
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
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
                  initData={initDataBank.current}
                  idParent={loader_data.ven_id}
                  banks={banks.current}
                  isallow={UPDATE.INIT}
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
                  iniData={initDataFile.current}
                  idParent={loader_data.ven_id}
                  onChildDataChange={setVen_fileFromChild}
                  allow={UPDATE.INIT}
                />
              </AccordionDetails>
            </Accordion>
            {ticketState === 'FINA' && (
              <Accordion expanded={expanded.panelApproval} onChange={handleExpanded('panelApproval')}>
                <AccordionSummary
                  sx={{ pointerEvents: 'none' }}
                  expandIcon={<ExpandMoreIcon sx={{ pointerEvents: 'auto' }} />}
                >
                  <Typography>Approval</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextFieldComp name="vendorcode" label="Vendor Code" control={control} readOnly={!UPDATE} />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}
            <Box sx={{ my: 5 }}>
              <TextFieldComp name="remarks" label="Remarks" control={control} />
            </Box>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                {loader_data.permission === undefined && (
                  <Button
                    sx={{ height: 50, width: 100, margin: 2 }}
                    color="error"
                    variant="text"
                    onClick={() => {
                      navigate('../ticket');
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
              <Box>
                {ticketState === 'CREA' && UPDATE.CREA && (
                  <Button
                    sx={{ height: 50, width: 100, margin: 2 }}
                    color="error"
                    variant="contained"
                    onClick={handleReject}
                  >
                    Reject
                  </Button>
                )}
                {(UPDATE.INIT || UPDATE.CREA || UPDATE.FINA) && (
                  <Button
                    sx={{ height: 50, width: 120, margin: 2 }}
                    color="warning"
                    variant="contained"
                    type="submit"
                    onClick={() => {
                      setDraft(true);
                    }}
                  >
                    Save Draft
                  </Button>
                )}
                {(UPDATE.INIT || UPDATE.CREA || UPDATE.FINA) && (
                  <Button
                    sx={{ height: 50, width: 100, margin: 2 }}
                    variant="contained"
                    type="submit"
                    onClick={() => {
                      setDraft(false);
                    }}
                  >
                    Submit
                  </Button>
                )}
              </Box>
            </Box>
          </Container>
        </form>

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
        <Snackbar open={false} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert severity="success" variant="filled">
            {`Ticket Number  has already submitted`}
          </Alert>
        </Snackbar>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer - 2 }} open={false}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog open={formStat.type === 'success'}>
          <Box
            sx={{
              width: 500,
              height: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'success.main',
            }}
          >
            <Typography variant="h4" sx={{ m: 2, borderRadius: 2 }} align="justify">
              {formStat.message}
            </Typography>
          </Box>
        </Dialog>
      </Container>
    </>
  );
}

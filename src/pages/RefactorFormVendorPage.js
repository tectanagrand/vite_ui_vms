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
  Link,
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
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import PatternFieldComp from 'src/components/common/PatternFieldComp';
import AutoCompleteSelect from 'src/components/common/AutoCompleteSelect';
import { LoadingButton } from '@mui/lab';

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
  BANK: [{ value: 'X', label: 'X' }],
  SHAREHOLDERS: [{ value: 'X', label: 'X' }],
  EMPLOYEE: [{ value: 'X', label: 'X' }],
  INTERDIVISION: [{ value: 'X', label: 'X' }],
};

const fileTypelist = [
  { key: 'SPPKP', value: 'SPPKP' },
  { key: 'NPWP', value: 'NPWP' },
  { key: 'KODE ETIK / PAKTA INTEGRITAS', value: 'KODE ETIK / PAKTA INTEGRITAS' },
  { key: 'SURAT PERNYATAAN REKENING', value: 'SURAT PERNYATAAN REKENING' },
  { key: 'BUKU TABUNGAN', value: 'BUKU TABUNGAN' },
  { key: 'KTP', value: 'KTP' },
];

const newFileTypelist = [
  { key: 'A001', value: 'Account Statement Letter' },
  { key: 'A002', value: 'Passbook' },
  { key: 'A003', value: 'ID Card (KTP)' },
  { key: 'A004', value: 'Integrity Pact' },
  { key: 'A005', value: 'NPWP (Tax ID Number)' },
  { key: 'A006', value: 'SPPKP' },
];

export default function RefactorFormVendorPage() {
  const predata = useLoaderData();
  const axiosPrivate = useAxiosPrivate();
  const defaultValue = {
    emailRequestor: '',
    deptRequestor: '',
    titlecomp: '',
    localovs: '',
    name1: '',
    country: '',
    street: '',
    street2: '',
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
    search_term: '',
  };

  const {
    handleSubmit,
    control,
    getValues,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm({ defaultValues: defaultValue });

  // console.log(errors);

  const [loader_data, setLoaderdata] = useState({
    ticket_id: '',
    ticket_num: '',
    ven_id: '',
    ticketState: '',
    data: '',
    permission: '',
    cur_pos: '',
  });
  useEffect(() => {
    const type = predata.type;
    const tokenform = predata.token;
    async function formLoader(token) {
      // axios.defaults.headers.common.Authorization =
      //   'Bearer ' + (Cookies.get('accessToken') === undefined ? '' : Cookies.get('accessToken'));
      const controller = new AbortController();
      const response = await axiosPrivate.get(`/ticket/form/${token}`, {
        signal: controller.signal,
      });
      const data = response.data.data;
      const valueForm = {
        emailRequestor: data.email_proc ? data.email_proc : '',
        deptRequestor: data.dep_proc ? data.dep_proc : '',
        titlecomp: data.title ? data.title : '',
        localovs: data.local_ovs ? data.local_ovs : '',
        name1: data['name_1'] ? data['name_1'] : '',
        country: data.country ? data.country : '',
        street: data.street ? data.street : '',
        street2: data.street2 ? data.street2 : '',
        postal: data.postal ? data.postal : '',
        city: data.city ? data.city : '',
        telf: data.telf1 ? data.telf1 : '',
        fax: data.fax ? data.fax : '',
        email: data.email ? data.email : '',
        ispkp: data.is_pkp ? data.is_pkp : false,
        npwp: data.npwp ? data.npwp : '',
        paymthd: data.pay_mthd ? data.pay_mthd : '',
        payterm: data.pay_term ? data.pay_term : 'I30',
        company: data.company ? data.company : '',
        purchorg: data.purch_org ? data.purch_org : '',
        vengroup: data.ven_group ? data.ven_group : '',
        venacc: data.ven_acc ? data.ven_acc : '',
        ventype: data.ven_type ? data.ven_type : '',
        currency: data.lim_curr ? data.lim_curr : '',
        description: data.description ? data.description : '',
        is_tender: data.is_tender ? data.is_tender : false,
        vendorcode: data.ven_code ? data.ven_code : data.header,
        remarks: data.remarks ? data.remarks : '',
        limit: data.limit_vendor ? data.limit_vendor : '',
        reject_by: data.reject_by ? data.reject_by : '',
        search_term: data.search_term ? data.search_term : '',
        is_active: data.ticket_stat,
      };

      if (valueForm.name1 === '') {
        setCheckex(true);
        setExpanded({
          panelReqDet: true,
          panelCompDet: true,
          panelAddr: false,
          panelTax: false,
          panelBank: false,
          panelFile: false,
          panelVendetail: false,
          panelApproval: false,
        });
      } else {
        setCheckex(false);
        setExpanded({
          panelReqDet: true,
          panelCompDet: true,
          panelAddr: true,
          panelTax: true,
          panelBank: true,
          panelFile: true,
          panelVendetail: true,
          panelApproval: true,
        });
      }

      setLoaderdata({
        ticket_id: data.ticket_id,
        ticket_num: data.ticket_num,
        ven_id: data.ven_id === null ? data.ticket_ven_id : data.ven_id,
        ticketState: data.ticket_state,
        ticket_type: data.t_type,
        data: valueForm,
        cur_pos: data.cur_pos,
      });

      return {
        ticket_id: data.ticket_id,
        ticket_num: data.ticket_num,
        ven_id: data.ven_id === null ? data.ticket_ven_id : data.ven_id,
        ticketState: data.ticket_state,
        data: valueForm,
      };
    }

    async function newformLoader(token) {
      const response = await axiosPrivate.get(`/ticket/newform/${token}`);
      setExpanded({
        panelReqDet: true,
        panelCompDet: true,
        panelAddr: false,
        panelTax: false,
        panelBank: false,
        panelFile: false,
        panelVendetail: false,
        panelApproval: false,
      });
      const data = response.data.data;
      const valueForm = {
        emailRequestor: data.email_proc ? data.email_proc : '',
        deptRequestor: data.dep_proc ? data.dep_proc : '',
        titlecomp: data.title ? data.title : '',
        localovs: data.local_ovs ? data.local_ovs : '',
        name1: data['name_1'] ? data['name_1'] : '',
        country: data.country ? data.country : '',
        street: data.street ? data.street : '',
        street2: data.street2 ? data.street2 : '',
        postal: data.postal ? data.postal : '',
        city: data.city ? data.city : '',
        telf: data.telf1 ? data.telf1 : '',
        fax: data.fax ? data.fax : '',
        email: data.email ? data.email : '',
        ispkp: data.is_pkp ? data.is_pkp : false,
        npwp: data.npwp ? data.npwp : '',
        paymthd: data.pay_mthd ? data.pay_mthd : '',
        payterm: data.pay_term ? data.pay_term : 'I30',
        company: data.company ? data.company : '',
        purchorg: data.purch_org ? data.purch_org : '',
        vengroup: data.ven_group ? data.ven_group : '',
        venacc: data.ven_acc ? data.ven_acc : '',
        ventype: data.ven_type ? data.ven_type : '',
        currency: data.lim_curr ? data.lim_curr : '',
        description: data.description ? data.description : '',
        is_tender: data.is_tender ? data.is_tender : false,
        vendorcode: data.ven_code ? data.ven_code : data.header,
        remarks: data.remarks ? data.remarks : '',
        limit: data.limit_vendor ? data.limit_vendor : '',
        reject_by: data.reject_by ? data.reject_by : '',
        is_active: data.ticket_stat,
        search_term: data.search_term ? data.search_term : '',
      };

      const perm = {
        INIT: {
          create: false,
          read: false,
          update: true,
          delete: false,
        },
        CREA: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
        FINA: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
      };

      if (valueForm.name1 === '') {
        setCheckex(true);
        setExpanded({
          panelReqDet: true,
          panelCompDet: true,
          panelAddr: false,
          panelTax: false,
          panelBank: false,
          panelFile: false,
          panelVendetail: false,
          panelApproval: false,
        });
      } else {
        setCheckex(false);
        setExpanded({
          panelReqDet: true,
          panelCompDet: true,
          panelAddr: true,
          panelTax: true,
          panelBank: true,
          panelFile: true,
          panelVendetail: true,
          panelApproval: true,
        });
      }

      setLoaderdata({
        ticket_id: data.ticket_id,
        ticket_num: data.ticket_num,
        ven_id: data.ven_id === null ? data.ticket_ven_id : data.ven_id,
        ticketState: data.ticket_state,
        ticket_type: data.t_type,
        data: valueForm,
        permission: perm,
        cur_pos: data.cur_pos,
      });

      return {
        ticket_id: data.ticket_id,
        ticket_num: data.ticket_num,
        ven_id: data.ven_id === null ? data.ticket_ven_id : data.ven_id,
        ticketState: data.ticket_state,
        data: valueForm,
        permission: perm,
      };
    }

    if (type === 'form') {
      formLoader(tokenform);
    } else {
      newformLoader(tokenform);
    }
  }, []);
  const params = useParams();
  const [chgCountry, setChgCty] = useState(loader_data.data?.country);
  const [chgVengrp, setVengrp] = useState(loader_data.data?.vengroup);
  const [chgVenacc, setVenacc] = useState(loader_data.data?.venacc);
  const [chgCurr, setChgCurr] = useState(loader_data.data?.currency);
  const [chgIsPTKP, setIsPTKP] = useState(false);
  const [chgLocal, setLocal] = useState('');
  const [compTitle, setComptitle] = useState(loader_data.data?.titlecomp);
  const [compName, setCompname] = useState();
  const [checkIsExist, setCheckex] = useState(true);
  const [isTender, setTender] = useState(loader_data.data?.is_tender);
  const [btnClicked, setBtnclick] = useState(false);

  const funChgCountry = (item) => {
    setChgCty(item);
    countrycode.current = item;
  };
  const funChgVgrp = (item) => {
    setVengrp(item);
  };
  const funChgVacc = (item) => {
    setVenacc(item);
    if (item !== 'TRADE') {
      clearErrors('currency');
      clearErrors('limit');
    }
  };
  const funChgIsPTKP = (item) => {
    setIsPTKP(item);
  };

  const checkExist = async (item) => {
    setLoadex(true);
    try {
      const checkExt = await axiosPrivate.get(`/vendor/checkven?name=${item}`);
      // console.log(checkExt);
      setCheckex(false);
      setExpanded({
        panelReqDet: true,
        panelCompDet: true,
        panelAddr: true,
        panelTax: true,
        panelBank: true,
        panelFile: true,
        panelVendetail: true,
        panelApproval: true,
      });
      setLoadex(false);
      setBtnclick(false);
    } catch (error) {
      console.log(error);
      setExpanded({
        panelReqDet: true,
        panelCompDet: true,
        panelAddr: false,
        panelTax: false,
        panelBank: false,
        panelFile: false,
        panelVendetail: false,
        panelApproval: false,
      });
      setLoadex(false);
    }
  };

  const funChgCurr = (item) => {
    setChgCurr(item);
  };

  const funChgLoc = (item) => {
    setLocal(item);
  };

  const funChgTdr = (item) => {
    setTender(item);
    if (!item) {
      clearErrors('description');
    }
  };

  const funChgTitle = (item) => {
    setComptitle(item);
  };

  const funChgname = (item) => {
    if (item != compName && item !== '') {
      setCheckex(true);
      setExpanded({
        panelReqDet: true,
        panelCompDet: true,
        panelAddr: false,
        panelTax: false,
        panelBank: false,
        panelFile: false,
        panelVendetail: false,
        panelApproval: false,
      });
      setBtnclick(true);
    } else if (compName != '') {
      setCheckex(false);
      setExpanded({
        panelReqDet: true,
        panelCompDet: true,
        panelAddr: true,
        panelTax: true,
        panelBank: true,
        panelFile: true,
        panelVendetail: true,
        panelApproval: true,
      });
      setBtnclick(false);
    }
  };

  useEffect(() => {
    reset(loader_data.data);
    setChgCty(loader_data.data?.country);
    setVengrp(loader_data.data?.vengroup);
    setVenacc(loader_data.data?.venacc);
    setChgCurr(loader_data.data?.currency);
    setTender(loader_data.data?.is_tender);
    setComptitle(loader_data.data?.titlecomp);
    setCompname(loader_data.data?.name1);
    setLocal(loader_data.data?.localovs);
  }, [loader_data]);

  useEffect(() => {
    const firstError = Object.keys(errors).reduce((field, a) => {
      return errors[field] ? field : a;
    }, null);
    if (firstError) {
      // console.log(firstError);
      setFocus(firstError);
    }
  }, [errors, setFocus]);

  const navigate = useNavigate();
  const { session, getPermission } = useSession();
  const ticketState = loader_data?.ticketState;
  const is_active = loader_data.data?.is_active;
  const countrycode = useRef(loader_data.data?.country);

  let permissions = {};
  if (is_active) {
    if (loader_data.permission != undefined) {
      permissions = loader_data.permission;
    } else {
      permissions.INIT = getPermission('Initial Form');
      permissions.CREA = getPermission('Creation Form');
      permissions.FINA = getPermission('Final Form');
    }
  } else {
    permissions = {
      INIT: { create: false, read: false, update: false, delete: false },
      CREA: { create: false, read: false, update: false, delete: false },
      FINA: { create: false, read: false, update: false, delete: false },
    };
  }

  const UPDATE = {
    INIT: permissions.INIT.update,
    CREA: permissions.CREA.update,
    FINA: permissions.FINA.update,
  };

  const countries = useRef([{ value: '', label: '' }]);
  const currencies = useRef([{ value: '', label: '' }]);
  // const cities = useRef([{ value: '', label: '' }]);
  const banks = useRef([{ value: '', label: '' }]);
  const payterm = useRef([{ value: '', label: '' }]);
  const comps = useRef([{ value: '', label: '' }]);
  const bank_valid = useRef(true);
  const file_valid = useRef(true);
  const initDataBank = useRef([]);
  const initDataFile = useRef([]);
  const [isFileload, setFileLoad] = useState(false);
  const [isBankload, setBankLoad] = useState(false);

  const [cities, setCities] = useState([{ value: '', label: '' }]);
  const [loading, setLoading] = useState(false);
  const [loadingEx, setLoadex] = useState(false);
  const is_draft = useRef(false);
  const [is_reject, setReject] = useState(false);

  const [loadingCountry, setLoadCountry] = useState(false);
  const [loadingCurr, setLoadCurr] = useState(false);
  const [loadingBanks, setLoadBanks] = useState(false);
  const [loadingInitBank, setLoadInitBank] = useState(false);
  const [loadingInitFile, setLoadInitFile] = useState(false);
  const [loadingComp, setLoadComp] = useState(false);
  const [loadingPayterm, setLoadPayterm] = useState(false);

  const vengroups = [
    { value: '3RD_PARTY', label: '3RD Party' },
    { value: 'BANK', label: 'Bank' },
    { value: 'SHAREHOLDERS', label: 'Shareholders' },
    { value: 'EMPLOYEE', label: 'Employee' },
    { value: 'INTERDIVISION', label: 'Interdivision' },
    { value: 'RELATED', label: 'Related' },
    { value: 'INTERCO', label: 'Interco' },
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
  useMemo(() => ({ cities, countries, currencies }), [cities, countries, currencies]);
  //set active section

  useEffect(() => {
    const dynaCity = async () => {
      countrycode.current = loader_data.data?.country;
      try {
        const getcities = await axiosPrivate.post(`/master/city`, {
          countryId: chgCountry,
        });
        const result = getcities.data.data;
        const convcity = result.data.map((item) => ({
          value: item.city,
          label: item.city,
        }));
        setCities(convcity);
      } catch (err) {
        alert(err.stack);
      }
    };
    dynaCity();
  }, [chgCountry, loader_data]);

  useEffect(() => {
    setLoading(true);
    const dynaCountry = async () => {
      setLoadCountry(true);
      try {
        const country = await axiosPrivate.post(`/master/country`);
        const result = country.data.data;
        countries.current = result.data.map((item) => ({
          value: item.country_code,
          label: item.country_name,
        }));
        setLoadCountry(false);
      } catch (err) {
        setLoadCountry(false);
        alert(err.stack);
      }
    };

    const getCurr = async () => {
      setLoadCurr(true);
      try {
        setLoadCurr(false);
        const curr = await axiosPrivate.get(`/master/curr`);
        const response = curr.data;
        const result = response.data;
        currencies.current = result.data.map((item) => ({
          value: item.code === null ? '' : item.code,
          label: item.code === null ? '' : item.code,
        }));
      } catch (err) {
        setLoadCurr(false);
        alert(err.stack);
      }
    };

    const getBanks = async () => {
      setLoadBanks(true);
      try {
        setLoadBanks(false);
        const banksData = await axiosPrivate.get(`/master/banksap`);
        const response = banksData.data;
        const result = response.data;
        banks.current = result;
      } catch (error) {
        setLoadBanks(false);
        console.log(error);
        alert(error.stack);
      }
    };

    const getInitDataBank = async () => {
      setLoadInitBank(true);
      try {
        const bankInit = await axiosPrivate.get(`/vendor/bank/${loader_data.ven_id}`);
        const result = bankInit.data.data;
        initDataBank.current = result.data;
        setLoadInitBank(false);
      } catch (err) {
        setLoadInitBank(false);
        console.log(err);
        alert(err.stack);
      }
    };

    const getInitDataFile = async () => {
      setLoadInitFile(true);
      try {
        const fileInit = await axiosPrivate.get(`/vendor/file/${loader_data.ven_id}`);
        const result = fileInit.data.data;
        initDataFile.current = result.data;
        setLoadInitFile(false);
      } catch (err) {
        setLoadInitFile(false);
        alert(err.stack);
      }
    };

    const getCompany = async () => {
      setLoadComp(true);
      try {
        const compsData = await axiosPrivate.get(`/master/company`);
        const response = compsData.data;
        const result = response.data;
        comps.current = result.data.map((item) => ({
          value: item.comp_id,
          label: item.code + ' - ' + item.name,
        }));
        setLoadComp(false);
      } catch (error) {
        setLoadComp(false);
        alert(error.stack);
      }
    };

    const getPayterm = async () => {
      setLoadPayterm(true);
      try {
        const paytermData = await axiosPrivate.get(`/master/payterm`);
        const data = paytermData.data.data;
        payterm.current = data.map((item) => ({
          value: item.term_code,
          label: `${item.term_code}-${item.term_name}`,
        }));
        setLoadPayterm(false);
      } catch (error) {
        setLoadPayterm(false);
        alert(error.stack);
      }
    };

    if (loader_data.ven_id !== '') {
      dynaCountry();
      getCurr();
      getBanks();
      getInitDataBank();
      getInitDataFile();
      getCompany();
      getPayterm();
      setLoading(false);
    }
  }, [loader_data]);

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
    }
    if (!checkIsExist) {
      if (panel === 'panelAddr') {
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
    }
  };

  const handleSnackClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFormStat({ ...formStat, stat: false });
  };

  const handleReject = async (value) => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const rejectParams = {
        ticket_id: loader_data.ticket_id,
        remarks: value.remarks,
      };
      const resultReject = await axiosPrivate.patch(`/ticket/reject`, rejectParams);
      const response = resultReject.data;
      setFormStat({ stat: true, type: 'success', message: response.message });
      setLoading(false);
      setTimeout(() => {
        navigate('../../dashboard/ticket');
      }, 2000);
    } catch (error) {
      setLoading(false);
      alert(error);
    }
  };

  useEffect(() => {
    if (!is_draft.current) {
      if (isFileload || isBankload) {
        // console.log(initDataFile.current);
        bank_valid.current = true;
        file_valid.current = true;
        let fileData = [...initDataFile.current, ...ven_file];
        let bankData = [...ven_bank];
        let checkFileExist = {
          A001: 0,
          A002: 0,
          A003: 0,
          A004: 0,
          A005: 0,
          A006: 0,
        };
        if (compTitle === 'COMPANY') {
          checkFileExist = {
            A001: 0,
            A002: 0,
            A004: 0,
            A005: 0,
            A006: 0,
          };
        } else if (compTitle === 'PERSONAL') {
          checkFileExist = {
            A001: 0,
            A002: 0,
            A003: 0,
            A004: 0,
          };
        }
        if (chgLocal === 'OVS') {
          delete checkFileExist.A005;
          delete checkFileExist.A006;
        }
        if (!chgIsPTKP) {
          delete checkFileExist.A006;
        }
        let filenames = {
          A001: 'Account Statement Letter',
          A002: 'Passbook',
          A003: 'ID Card (KTP)',
          A004: 'Integrity Pact',
          A005: 'NPWP (Tax ID Number)',
          A006: 'SPPKP',
        };
        let fileremain = [];
        //check if file or banks is already submitted
        if (initDataBank.current.length === 0 && ven_bank.length === 0) {
          setFormStat({ stat: true, type: 'error', message: 'Banks not filled yet | Bank belum dilengkapi' });
          bank_valid.current = false;
        }
        bankData.forEach((item) => {
          // console.log(item);
          Object.values(item).map((value) => {
            if (value === '' || value === null) {
              setFormStat({ stat: true, type: 'error', message: 'Banks not filled yet | Bank belum dilengkapi' });
              bank_valid.current = false;
            }
          });
        });
        if (fileData.length === 0) {
          setFormStat({ stat: true, type: 'error', message: 'Attachment not filled yet | Lampiran belum dilengkapi' });
          file_valid.current = false;
        }
        fileData.forEach((item) => {
          checkFileExist[item.file_type] = checkFileExist[item.file_type] + 1;
        });
        Object.keys(checkFileExist).map((keys) => {
          if (checkFileExist[keys] === 0) {
            fileremain.push(filenames[keys]);
          }
        });
        if (fileremain.length > 0) {
          file_valid.current = false;
          setFormStat({ stat: true, type: 'error', message: `Surat berikut belum lengkap : ${fileremain.join(', ')}` });
        }
      } else {
        setFileLoad(true);
        setBankLoad(true);
      }
    }
    setBtnclick(false);
  }, [isSubmitting]);
  const submitForm = async (value) => {
    setBtnclick(true);
    if (is_reject === true) {
      await handleReject(value);
      return;
    }
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
      street2: value.street2,
      telf1: value.telf,
      fax: value.fax,
      email: value.email,
      is_pkp: value.ispkp,
      is_tender: value.is_tender,
      npwp: value.npwp.trim(),
      pay_mthd: value.paymthd,
      pay_term: value.payterm,
      company: value.company,
      purch_org: value.purchorg,
      ven_acc: value.venacc,
      ven_group: value.vengroup,
      ven_type: value.ventype,
      description: value.description,
      limit_vendor: value.limit.toString().match(/\d+/g)?.join(''),
      lim_curr: value.currency,
      ven_code: value.vendorcode,
      search_term: value.search_term,
    };
    const jsonSend = {
      role: session.role === undefined ? 'VENDOR' : session.role,
      is_draft: is_draft.current,
      ticket_id: loader_data.ticket_id,
      remarks: value.remarks,
      ticket_state: ticketState,
      ven_detail: ven_detail,
      ven_banks: ven_bank,
      ven_files: ven_file,
    };
    setVen_bank((prev) => prev.map((item) => ({ ...item, method: 'update' })));
    // console.log(jsonSend);
    if (loader_data.data.reject_by !== '') {
      jsonSend.remarks = '';
    }
    if (UPDATE.FINA) {
      jsonSend.mdm_id = session.user_id;
    }
    try {
      if (!(bank_valid.current && file_valid.current)) {
        if (!is_draft.current) {
          return;
        }
      }
      setLoading(true);
      let submit;
      if (session.role === undefined || predata.type !== 'form') {
        submit = await axios.post(`${process.env.REACT_APP_URL_LOC}/ticket/newform/submit`, jsonSend);
        // console.log('submitting...');
      } else {
        submit = await axiosPrivate.post(`/ticket/form/submit`, jsonSend);
        // console.log('submitting...');
      }
      const response = submit.data;
      setFormStat({ stat: true, type: 'success', message: response.message });
      setLoading(false);
      setBtnclick(false);
      if (!is_draft.current) {
        setTimeout(() => {
          if (UPDATE.INIT) {
            navigate(0);
          } else {
            navigate('../../dashboard/ticket');
          }
        }, 3000);
        // console.log('reloading...');
      }
    } catch (err) {
      setBtnclick(false);
      console.log(err.stack);
      // alert(err.stack);
      setFormStat({ stat: true, type: 'error', message: 'error submitting' });
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box sx={{ height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {`Form Vendor Registration ${loader_data.ticket_num}`}
          </Typography>
        </Box>
        <Container>
          <form key={1} onSubmit={handleSubmit(submitForm)}>
            <Alert severity="warning" variant="filled" sx={{ width: '45rem', mt: '1rem', mb: '1rem' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                Please download file Pakta Integritas below before submitting
                <Link
                  href={`${process.env.REACT_APP_URL_LOC}/master/file/Kode_Etik_Supplier_Vendor_dan_Kontraktor.doc`}
                >
                  Link Download File Pakta Integritas
                </Link>
              </Box>
            </Alert>
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
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                      onChangeovr={funChgTitle}
                      options={title}
                      rules={{ required: 'Please insert this field' }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <SelectComp
                      name="localovs"
                      label="Local / Overseas"
                      control={control}
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                      options={localoverseas}
                      rules={{ required: 'Please insert this field' }}
                      onChangeovr={funChgLoc}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextFieldComp
                      name="name1"
                      label="Company Name"
                      control={control}
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                      rules={{
                        required: 'Please insert this field',
                        maxLength: { value: 300, message: 'Max 300 Character' },
                      }}
                      onChangeovr={funChgname}
                    />
                  </Grid>
                  {checkIsExist && (
                    <Grid item xs={2}>
                      <LoadingButton
                        onClick={() => checkExist(getValues('name1'))}
                        sx={{ width: '4rem', height: '3.5rem' }}
                        loading={loadingEx}
                      >
                        Verify
                      </LoadingButton>
                    </Grid>
                  )}

                  {(ticketState === 'CREA' || ticketState === 'FINA') && UPDATE[ticketState] && (
                    <Grid item xs={6}>
                      <TextFieldComp
                        name="search_term"
                        label="Search Term"
                        control={control}
                        readOnly={!(UPDATE.CREA && ticketState === 'CREA')}
                        rules={{
                          required: 'Please insert this field',
                          maxLength: { value: 100, message: 'Max 100 Character' },
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
            {checkIsExist && (
              <Alert sx={{ mt: '2rem', mb: '2rem' }} severity="error" variant="filled">
                Company Name Already Exist or Not Valid
              </Alert>
            )}
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
                  <Grid item xs={9}>
                    <TextFieldComp
                      name="street"
                      label="Address"
                      control={control}
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                      rules={{
                        required: 'Please insert this field',
                        maxLength: { value: 200, message: 'Max 200 Character' },
                      }}
                    />
                  </Grid>
                  {(ticketState === 'CREA' || ticketState === 'FINA') && (
                    <Grid item xs={9}>
                      <TextFieldComp
                        name="street2"
                        label="Address 2"
                        control={control}
                        readOnly={
                          !(
                            (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC') ||
                            (UPDATE.FINA && ticketState === 'FINA')
                          )
                        }
                        rules={{
                          maxLength: { value: 160, message: 'Max 160 Character' },
                        }}
                      />
                    </Grid>
                  )}
                  <Grid item xs={3}></Grid>
                  <Grid item xs={3}>
                    <SelectComp
                      name="country"
                      label="Country"
                      control={control}
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                      options={countries.current}
                      onChangeovr={funChgCountry}
                      rules={{
                        required: 'Please insert this field',
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <PatternFieldComp
                      name="postal"
                      label="Postal Code"
                      control={control}
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                      rules={{
                        required: chgLocal === 'OVS' ? false : 'Please insert this field',
                      }}
                      format="################"
                      isNumString={false}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <AutoCompleteSelect
                      name="city"
                      label="City"
                      control={control}
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                      options={cities}
                      rules={{
                        required: 'Please insert this field',
                      }}
                      freeSolo={true}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <PatternFieldComp
                      name="telf"
                      label="Telephone Number"
                      control={control}
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                      format="################"
                      isNumString={false}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextFieldComp
                      name="fax"
                      label="Fax"
                      control={control}
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextFieldComp
                      name="email"
                      label="Email"
                      control={control}
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
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
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                      onChangeovr={funChgIsPTKP}
                    />
                  </Grid>
                  <Grid item xs={9}></Grid>
                  <Grid item xs={4}>
                    <TextFieldComp
                      name="npwp"
                      label="Tax Number"
                      control={control}
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                      rules={{
                        pattern: {
                          value: /^[0-9.-]+$/,
                          message: 'format not matched. only numbers (0-9), point (.), and hyphen (-)',
                        },
                        required: chgIsPTKP ? 'this field is required' : false,
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <SelectComp
                      name="paymthd"
                      label="Payment Method"
                      control={control}
                      options={[
                        { value: 'bank', label: 'Bank' },
                        { value: 'cash', label: 'Cash' },
                        { value: 'Giro', label: 'Giro' },
                      ]}
                      readOnly={
                        !(
                          (UPDATE.INIT && ticketState === 'INIT') ||
                          (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                        )
                      }
                      rules={{
                        required: 'Please insert this field',
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectComp
                      name="payterm"
                      label="Payment Term"
                      control={control}
                      options={payterm.current}
                      readOnly={!((UPDATE.INIT && ticketState === 'INIT') || (UPDATE.CREA && ticketState === 'CREA'))}
                      rules={{
                        required: 'Please insert this field',
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {(ticketState === 'CREA' || ticketState === 'FINA' || ticketState === 'END') && (
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
                        readOnly={!(ticketState === 'CREA' && UPDATE.CREA)}
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
                        readOnly={!(ticketState === 'CREA' && UPDATE.CREA)}
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
                        readOnly={!(ticketState === 'CREA' && UPDATE.CREA)}
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
                        readOnly={!(ticketState === 'CREA' && UPDATE.CREA)}
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
                        options={
                          chgVenacc !== 'NON_TRADE'
                            ? [{ value: 'X', label: 'X' }]
                            : ventypeList[chgVengrp]
                            ? ventypeList[chgVengrp]
                            : [{ value: 'X', label: 'X' }]
                        }
                        readOnly={!(ticketState === 'CREA' && UPDATE.CREA)}
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
                        disabled={chgVenacc === 'NON_TRADE'}
                        readOnly={!(ticketState === 'CREA' && UPDATE.CREA)}
                        rules={{ required: chgVenacc === 'TRADE' ? 'Please insert this field' : false }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <NumericFieldComp
                        name="limit"
                        label="Limit"
                        control={control}
                        format={['thousandSeparator']}
                        currency={chgCurr}
                        disabled={chgVenacc === 'NON_TRADE'}
                        readOnly={!(ticketState === 'CREA' && UPDATE.CREA)}
                        rules={{ required: chgVenacc === 'TRADE' ? 'Please insert this field' : false }}
                      />
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={12}>
                      <TextFieldComp
                        name="description"
                        label="Description"
                        control={control}
                        readOnly={!(ticketState === 'CREA' && UPDATE.CREA)}
                        rules={{ required: isTender ? 'Please insert this field' : false }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <CheckboxComp
                        name="is_tender"
                        label="Tender Participation Above One Billion"
                        control={control}
                        readOnly={!(ticketState === 'CREA' && UPDATE.CREA)}
                        onChangeovr={funChgTdr}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}
          </form>
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
                currencies={currencies.current}
                countries={countries.current}
                isallow={(UPDATE.INIT || UPDATE.CREA) && (ticketState === 'INIT' || loader_data.ticket_type === 'PROC')}
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
                inputTypes={newFileTypelist}
                iniData={initDataFile.current}
                idParent={loader_data.ven_id}
                onChildDataChange={setVen_fileFromChild}
                allow={
                  (UPDATE.INIT && ticketState === 'INIT') ||
                  (UPDATE.CREA && ticketState === 'CREA' && loader_data.ticket_type === 'PROC')
                }
              />
            </AccordionDetails>
          </Accordion>
          {(ticketState === 'FINA' || ticketState === 'END') && (
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
                    <TextFieldComp
                      name="vendorcode"
                      label="Vendor Code"
                      control={control}
                      readOnly={!(ticketState === 'FINA' && UPDATE.FINA)}
                      rules={{
                        required: 'Please insert this field',
                        maxLength: {
                          value: 10,
                          message: 'Max character is 10',
                        },
                        minLength: {
                          value: 10,
                          message: 'Min character is 10',
                        },
                      }}
                    />
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
                  Back
                </Button>
              )}
            </Box>
            <Box>
              {((ticketState === 'CREA' && UPDATE.CREA && loader_data.ticket_type !== 'PROC') ||
                (ticketState === 'FINA' && UPDATE.FINA && loader_data.cur_pos !== 'MGR')) && (
                <Button
                  sx={{ height: 50, width: 100, margin: 2 }}
                  color="error"
                  variant="contained"
                  onClick={() => {
                    handleReject(getValues());
                  }}
                >
                  Reject
                </Button>
              )}
              {UPDATE[ticketState] && loader_data.cur_pos !== 'MGR' && (
                <Button
                  sx={{ height: 50, width: 120, margin: 2 }}
                  color="warning"
                  variant="contained"
                  onClick={() => {
                    is_draft.current = true;
                    submitForm(getValues());
                  }}
                  disabled={btnClicked}
                >
                  Save Draft
                </Button>
              )}
              {UPDATE[ticketState] && loader_data.cur_pos !== 'MGR' && (
                <Button
                  sx={{ height: 50, width: 100, margin: 2 }}
                  variant="contained"
                  type="submit"
                  onClick={handleSubmit((value) => {
                    // console.log(value);
                    is_draft.current = false;
                    submitForm(value);
                  })}
                  disabled={btnClicked}
                >
                  Submit
                </Button>
              )}
            </Box>
          </Box>
        </Container>

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
        <Snackbar
          open={loader_data.ticketState !== 'INIT' && UPDATE.INIT}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success" variant="filled">
            {`Ticket Number ${loader_data.ticket_num} has already submitted`}
          </Alert>
        </Snackbar>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer - 2 }}
          open={
            loading ||
            (loadingCountry &&
              loadingCurr &&
              loadingBanks &&
              loadingInitBank &&
              loadingInitFile &&
              loadingComp &&
              loadingPayterm)
          }
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog open={formStat.type === 'success' && is_draft.current == false}>
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

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
  Stack,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useRef, useEffect } from 'react';
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
  };
  const [ven_bank, setVen_bank] = useState([]);
  const [ven_file, setVen_file] = useState([]);
  const [localovs, setLocalovs] = useState('');
  const [expanded, setExpanded] = useState({
    panelReqDet: true,
    panelCompDet: false,
    panelAddr: false,
  });

  const setVen_bankFromChild = (newItem) => {
    setVen_bank(newItem);
    console.log(ven_bank);
  };

  const setVen_fileFromChild = (newItem) => {
    setVen_file(newItem);
    // console.log(newItem);
    // console.log(ven_file);
  };

  const handleChangeLocOvs = (e, data) => {
    console.log(data);
    setLocalovs(e.target.value);
  };

  const handleSubmit = (event) => {
    console.log(ven_bank);
    console.log(ven_file);
  };
  const handleFormChange = (e) => {
    console.log(e.target.value);
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
                  <TextField fullWidth id="emailRequestor" label="Email" variant="outlined" />
                </Grid>
                <Grid item xs>
                  <TextField fullWidth id="deptRequestor" label="Department" variant="outlined" />
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
                <Grid item xs>
                  <TextField fullWidth id="titleComp" label="Title" variant="outlined" />
                </Grid>
                <Grid item xs>
                  <FormControl fullWidth>
                    <InputLabel id="local-ovs-label">Local / Overseas</InputLabel>
                    <Select
                      id="localOverseas"
                      labelId="local-ovs-label"
                      value={localovs}
                      label="Local / Overseas"
                      variant="outlined"
                      onChange={handleChangeLocOvs}
                    >
                      <MenuItem value={'local'}>Local</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={8}>
                  <TextField fullWidth id="nameComp" label="Company Name" variant="outlined" />
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
                    <Select id="countrySelect" labelId="countrySelect" label="Country" variant="outlined">
                      <MenuItem>Check1</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={9}>
                  <TextField fullWidth id="addressField" label="Address" />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="postalCode">Postal</InputLabel>
                    <Select id="postalCode" labelId="postalCode" label="Postal" variant="outlined">
                      <MenuItem>Postal</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <TextField fullWidth id="cityField" label="City" />
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={3}>
                  <TextField fullWidth id="telf1Field" label="Telephone" />
                </Grid>
                <Grid item xs={3}>
                  <TextField fullWidth id="faxField" label="Fax" />
                </Grid>
                <Grid item xs={3}>
                  <TextField fullWidth id="email" label="Email" />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion>
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
                    <FormControlLabel control={<Checkbox id="is_PKP" />} label="Pengusaha Kena Pajak (PKP)" />
                  </FormGroup>
                </Grid>
                <Grid item xs={9}></Grid>
                <Grid item xs={6}>
                  <TextField fullWidth id="taxNumberField" label="Tax Number (NPWP)" />
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="paymentMethodField">Payment Method</InputLabel>
                    <Select id="paymentMethodLabel" labelId="paymentMethodLabel" variant="outlined">
                      <MenuItem>Bank</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="paymentTermField">Payment Term</InputLabel>
                    <Select id="paymentTermField" labelId="paymentTermField" variant="outlined">
                      <MenuItem>30</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion>
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
          <Accordion>
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

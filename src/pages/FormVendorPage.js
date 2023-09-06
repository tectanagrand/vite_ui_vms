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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

export default function FormVendorPage() {
  const [localovs, setLocalovs] = useState('');
  const [expanded, setExpanded] = useState({
    panelReqDet: true,
    panelCompDet: false,
    panelAddr: false,
  });
  const handleChangeLocOvs = (e, data) => {
    console.log(data);
    setLocalovs(e.target.value);
  };
  const handleExpanded = (panel) => (e, isExpand) => {
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
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panelReqDet">
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
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panelCompDet">
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
                      key="localOverseas"
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
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panelAddr">
              <Typography>Address</Typography>
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
        </Container>
      </Container>
    </>
  );
}

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stack,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useState, forwardRef, useEffect } from 'react';
import VenFileTable from '../FormVendor/VenFileTable';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function UploadButton({ inputTypes, onChildDataChange, iniData, idParent, allow }) {
  const [typeFile, setTypeFile] = useState(0);
  const [statUpload, setStatUpload] = useState({ stat: false, type: '', message: '' });
  const [fileStaged, setFileStaged] = useState([]);
  const inTypes = [{ key: 'pleaseSelect', value: 'Please Select Item' }, ...inputTypes];

  const sendDataParent = (file_ven) => {
    let items = [];
    file_ven.map((item) => {
      if (item.method !== '') {
        let temp = { ...item };
        delete temp.id;
        items.push(temp);
      }
    });
    // console.log('from table:');
    // console.log(items);
    onChildDataChange(items);
  };

  useEffect(() => {
    if (Object.keys(iniData).length != 0) {
      const covtData = [];
      iniData.map((item) => {
        covtData.push({ ...item, method: '', id: item.file_id });
      });
      // console.log(covtData);
      setFileStaged([...fileStaged, ...covtData]);
      sendDataParent(fileStaged);
    }
  }, [iniData]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setStatUpload({ ...statUpload, stat: false });
  };

  const handleUpFromTb = (newItem) => {
    // console.log(newItem);
    setFileStaged(newItem);
    sendDataParent(newItem);
  };

  const handleValidate = (event) => {
    if (typeFile == 0) {
      setStatUpload({ stat: true, type: 'error', message: 'Type File not Chosen' });
      event.preventDefault();
      return;
    }
  };
  const handleUpload = async (event) => {
    try {
      const selectedFile = [...event.target.files];
      let form = new FormData();
      selectedFile.forEach((item, idx) => {
        form.append('file_atth', item, item.name);
      });
      form.append('method', 'insert');
      form.append('file_type', inTypes[typeFile].key);
      form.append('created_by', 'MXMS');
      form.append('desc_file', inTypes[typeFile].value);
      form.append('ven_id', idParent);
      const response = await fetch(`${process.env.REACT_APP_URL_LOC}/vendor/uploadTemp`, {
        method: 'POST',
        body: form,
      });
      let items = await response.json();
      // console.log(items);
      if (items.status == 200) {
        const dataUploaded = items.data.map((item) => ({ ...item, id: item.file_id }));
        setFileStaged([...fileStaged, ...dataUploaded]);
        sendDataParent([...fileStaged, ...dataUploaded]);
        // console.log(fileStaged);
        setStatUpload({ stat: true, type: 'success', message: 'File Upload Success' });
      } else {
        setStatUpload({ stat: true, type: 'error', message: 'File Upload Error' });
      }
      document.getElementById('fileUpload').value = null;
    } catch (err) {
      setStatUpload({ stat: true, type: 'error', message: 'File Upload Error' });
      console.error(err);
    }
  };

  const handleChangeType = (e) => {
    setTypeFile(e.target.value);
  };
  return (
    <>
      <Stack spacing={2}>
        <Typography sx={{ ml: 2, mb: 2 }}>Upload File Here</Typography>
        <Box sx={{ width: 500, height: 50, display: 'flex', alignItems: 'center' }}>
          <Button
            component="label"
            startIcon={<UploadFileIcon />}
            variant="outlined"
            sx={{ height: 50, width: 300, margin: 2 }}
            onClick={handleValidate}
            disabled={!allow}
          >
            Upload
            <input type="file" id="fileUpload" name="fileUpload" multiple hidden onChange={handleUpload} />
          </Button>
          <FormControl fullWidth>
            <InputLabel htmlFor="fileType" id="fileType-label">
              <Typography>Type File</Typography>
            </InputLabel>
            <Select
              label="Type File *"
              id="fileType"
              labelId="fileType-label"
              onChange={handleChangeType}
              value={typeFile}
            >
              {inTypes.map((item, idx) => (
                <MenuItem value={idx} key={item.key}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Snackbar
          open={statUpload.stat}
          onClose={handleClose}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity={statUpload.type} onClose={handleClose}>
            {statUpload.message}
          </Alert>
        </Snackbar>
        <VenFileTable initData={fileStaged} upTable={handleUpFromTb} isallow={allow} />
      </Stack>
    </>
  );
}

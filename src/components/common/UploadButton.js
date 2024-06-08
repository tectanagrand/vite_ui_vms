import {
  Box,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stack,
  Snackbar,
  Alert as MuiAlert,
  Tooltip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useState, forwardRef, useEffect } from 'react';
import VenFileTable from '../FormVendor/VenFileTable';
import { useSession } from 'src/provider/sessionProvider';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { Help } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UploadButton = forwardRef(function UploadButton(
  { inputTypes, onChildDataChange, iniData, idParent, allow, loadData, deleteFile, requiredFiles, fileCheck, lang },
  ref
) {
  const { t } = useTranslation('translation', { lng: lang });
  const { session } = useSession();
  const [typeFile, setTypeFile] = useState(0);
  const [statUpload, setStatUpload] = useState({ stat: false, type: '', message: '' });
  const [fileStaged, setFileStaged] = useState([]);
  const inTypes = [{ key: 'pleaseSelect', value: 'Please Select Item' }, ...inputTypes];
  const [btnClicked, setBtnclick] = useState(false);
  const theme = useTheme();

  const sendDataParent = (file_ven) => {
    let items = [];
    file_ven.map((item) => {
      let temp = { ...item };
      delete temp.id;
      items.push(temp);
    });
    onChildDataChange(items);
  };

  useEffect(() => {
    if (Object.keys(iniData).length != 0) {
      const covtData = [];
      iniData.map((item) => {
        covtData.push({ ...item, method: '', id: item.file_id });
      });
      setFileStaged([...covtData]);
      sendDataParent([...covtData]);
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

  const openFileGuide = () => {
    window.open(`${process.env.REACT_APP_URL_BE}static/ATTACHMENT GUIDE VENDOR WEB.pdf`);
  };

  const handleValidate = (event) => {
    if (typeFile == 0) {
      setStatUpload({ stat: true, type: 'error', message: 'Type File not Chosen' });
      event.preventDefault();
      return;
    }
  };
  const handleUpload = async (event) => {
    setBtnclick(true);
    try {
      const selectedFile = [...event.target.files];
      let form = new FormData();
      selectedFile.forEach((item, idx) => {
        form.append('file_atth', item, item.name);
      });
      form.append('method', 'insert');
      form.append('file_type', inTypes[typeFile].key);
      form.append('created_by', session.user_id);
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
        // console.log(dataUploaded);
        setFileStaged([...fileStaged, ...dataUploaded]);
        sendDataParent([...fileStaged, ...dataUploaded]);
        // console.log(fileStaged);
        setStatUpload({ stat: true, type: 'success', message: 'File Upload Success' });
        setBtnclick(false);
      } else {
        setStatUpload({ stat: true, type: 'error', message: items.message });
        setBtnclick(false);
      }
      document.getElementById('fileUpload').value = null;
    } catch (err) {
      setBtnclick(false);
      setStatUpload({ stat: true, type: 'error', message: err.message });
      console.error(err);
    }
  };

  const handleChangeType = (e) => {
    setTypeFile(e.target.value);
  };
  return (
    <>
      <Stack spacing={2}>
        <Box style={{ display: 'flex', gap: 3, alignContent: 'center' }}>
          <Typography sx={{ ml: 2, mb: 2, mt: 2 }}>Upload File Here</Typography>
          <Tooltip title={<h4>Attachment File Guide</h4>}>
            <IconButton color="primary" onClick={openFileGuide}>
              <Help fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ width: 500, height: 50, display: 'flex', alignItems: 'center' }}>
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
          <LoadingButton
            component="label"
            startIcon={<UploadFileIcon />}
            variant="outlined"
            sx={{ height: 50, width: 300, margin: 2 }}
            onClick={handleValidate}
            disabled={!allow || (fileCheck && fileCheck[inTypes[typeFile].key] !== undefined)}
            loading={btnClicked}
            ref={ref}
          >
            Upload
            <input type="file" id="fileUpload" name="fileUpload" multiple hidden onChange={handleUpload} />
          </LoadingButton>
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
        {requiredFiles.length > 0 && (
          <>
            <p style={{ color: 'red' }}>
              Files are required : {requiredFiles.map((item) => t(item.message)).join(', ')}
            </p>
          </>
        )}
        <VenFileTable
          initData={fileStaged}
          upTable={handleUpFromTb}
          isallow={allow}
          isLoad={loadData}
          delFile={deleteFile}
          t={t}
        />
      </Stack>
    </>
  );
});

export default UploadButton;

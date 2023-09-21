import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, Stack } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useState } from 'react';
import VenFileTable from '../FormVendor/VenFileTable';

export default function UploadButton({ uploadHandler, inputTypes, onChildDtChg, iniData }) {
  const [typeFile, setTypeFile] = useState('');
  const [fileList, setFileList] = useState([]);
  const files = fileList ? [...fileList] : [];

  const handleUpload = async (event) => {
    try {
      setFileList(event.target.files);
      // let fileUp = [];
      // console.log(files);
      let form = new FormData();
      files.forEach((item, idx) => {
        form.append('file_atth', item, item.name);
      });
      form.append('method', 'insert');
      form.append('file_type', 'KTP');
      form.append('created_by', 'MXMS');
      form.append('desc_file', 'KTP');
      form.append('ven_id', '12312412');
      const response = await fetch(`${process.env.REACT_APP_URL_LOC}/vendor/uploadTemp`, {
        method: 'POST',
        body: form,
      });
      console.log(response);
    } catch (err) {
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
          >
            Upload
            <input type="file" id="fileUpload" name="fileUpload" multiple hidden onChange={handleUpload} />
          </Button>
          <FormControl fullWidth>
            <InputLabel htmlFor="fileType">
              <Typography>Type File</Typography>
            </InputLabel>
            <Select label="Type File" id="fileType" labelId="fileType" onChange={handleChangeType} value={typeFile}>
              {inputTypes.map((item) => {
                return (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <VenFileTable onChildDataChange={onChildDtChg} initData={iniData} />
      </Stack>
    </>
  );
}

import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, Stack } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useState } from 'react';
import { ControlPointSharp } from '@mui/icons-material';

export default function UploadButton({ uploadHandler, inputTypes }) {
  const [typeFile, setTypeFile] = useState('');
  const [fileList, setFileList] = useState();
  const files = fileList ? [...fileList] : [];

  const handleUpload = async (event) => {
    try {
      setFileList(event.target.files);
      let form = new FormData();
      files.forEach((file, idx) => {
        form.append(`file`, file, file.name);
      });
      form.append('method', 'insert');
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
      <Stack>
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
      </Stack>
    </>
  );
}

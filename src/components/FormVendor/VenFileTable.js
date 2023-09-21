import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useState, forwardRef } from 'react';
import { Delete as DeleteIcon, Undo } from '@mui/icons-material';
import { Alert as MuiAlert, Snackbar } from '@mui/material';
import { styled, lighten, darken } from '@mui/material/styles';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" style={{ position: 'fixed' }} {...props} />;
});

export default function VenFileTable({ onChildDataChange, initData }) {
  console.log(initData);
  const DataGridFile = styled(DataGrid)(() => ({
    '& .row-idle': {
      backgroundColor: '#fff',
    },
    '& .row-delete': {
      backgroundColor: '#fc8b72',
      '&:hover': {
        backgroundColor: lighten('#fc8b72', 0.2),
      },
      '&.Mui-selected': {
        backgroundColor: darken('#fc8b72', 0.2),
        '&:hover': {
          backgroundColor: lighten('#fc8b72', 0.2),
        },
      },
    },
  }));

  let covtData = [];
  if (initData != null) {
    initData.map((item) => {
      covtData.push({ ...item, mode: 'delete' });
    });
  }

  const [file_bank, setFile_bank] = useState(covtData ? covtData : []);
  const [sbarOpen, setSbarOpen] = useState(false);
  const [fetchStat, setFetchStat] = useState({});

  const onDeleteSBar = () => {
    setSbarOpen(true);
  };

  const onCloseBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSbarOpen(false);
  };

  const sendDataParent = (file_bank) => {
    let items = [];
    file_bank.map((item) => {
      if (item.mode !== '') {
        let temp = { ...item };
        delete temp.isDb;
        delete temp.isNew;
        items.push(temp);
      }
    });
    onChildDataChange(items);
  };
  const handleDeleteClick = (id) => () => {
    let prevData = [];
    file_bank.map(async (item) => {
      try {
        if (item.id === id) {
          if (item.source == 'ven_bank_file_atth') {
            prevData.push({ ...item, mode: 'delete' });
            setFetchStat({
              stat: 'success',
              message: `temporary file ${item.file_name} deleted`,
            });
            onDeleteSBar();
          } else {
            const deletedFile = await fetch(`${process.env.REACT_APP_URL_LOC}/vendor/file/${id}`, {
              method: 'DELETE',
            });
            if (deletedFile) {
              onDeleteSBar();
              setFetchStat({
                stat: 'success',
                message: `temporary file ${deletedFile} deleted`,
              });
            }
          }
        } else {
          prevData.push(item);
        }
      } catch (err) {
        setFetchStat({
          stat: 'error',
          message: 'error deleting item',
        });
      }
    });
    setFile_bank(prevData);
    sendDataParent(prevData);
  };

  const handleUndoClick = (id) => () => {
    let pushData = [];
    file_bank.map((item) => {
      if (item.id === id) {
        pushData.push({ ...item, mode: '' });
      } else {
        pushData.push(item);
      }
    });
    setFile_bank(pushData);
    sendDataParent(pushData);
    onDeleteSBar();
  };

  const columns = [
    {
      field: 'desc_file',
      type: 'string',
      headerName: 'Type',
      width: 200,
    },
    { field: 'file_name', type: 'string', headerName: 'File Name', width: 200 },
    {
      field: 'action',
      type: 'actions',
      headerName: 'Action',
      width: 100,
      cellClassName: 'actions',
      getActions: (item) => {
        if (item.row.mode == 'delete') {
          return [<GridActionsCellItem icon={<Undo />} label="Undo" onClick={handleUndoClick(item.id)} />];
        } else {
          return [<GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(item.id)} />];
        }
      },
    },
  ];

  return (
    <>
      <DataGridFile
        rows={file_bank}
        columns={columns}
        getRowClassName={(params) => {
          if (params.row.mode == 'delete') {
            return 'row-delete';
          } else {
            return 'row-idle';
          }
        }}
      />
      <Snackbar open={sbarOpen} autoHideDuration={3000} onClose={onCloseBar}>
        <Alert severity={fetchStat.stat ? 'fetchStat.stat' : 'info'}>
          {fetchStat.message ? fetchStat.message : 'test'}
        </Alert>
      </Snackbar>
    </>
  );
}
